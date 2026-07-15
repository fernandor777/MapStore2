import Rx from 'rxjs';
import { SEND_MESSAGE, receiveResponse, setError } from '../actions/aiAssistant';
import {
    queryAI,
    uploadGeoPackage as uploadGeoPackageApi,
    uploadGeoTiff as uploadGeoTiffApi,
    uploadGeoPackageToPostgis as uploadGeoPackageToPostgisApi
} from '../api/aiService';
import { buildMapContext } from '../utils/mapContextBuilder';
import { dispatchCommands } from '../utils/commandDispatcher';

const RASTER_EXTENSIONS = /\.tif{1,2}$/i;
const POSTGIS_INTENT = /postgis|postgres/i;

function fileToStoreName(file) {
    return file.name.replace(/\.gpkg$/i, '').replace(/[^a-zA-Z0-9_]/g, '_') || 'gpkg_store';
}

function isRasterFile(file) {
    return RASTER_EXTENSIONS.test(file.name);
}

function wantsPostgisImport(message) {
    return POSTGIS_INTENT.test(message || '');
}

export const sendMessageEpic = (action$, store) =>
    action$.ofType(SEND_MESSAGE)
        .switchMap(({ message, file }) => {
            const state = store.getState();
            const mapContext = buildMapContext(state);
            const sessionId = state.aiAssistant && state.aiAssistant.sessionId;

            // When a file is attached: upload it first, then call the AI with
            // the upload result as additional context alongside the user's message.
            // GeoTIFFs are always staged only (analyzed/optimized before publish). GeoPackages
            // are published immediately UNLESS the message signals PostGIS intent (e.g. mentions
            // "postgis"/"postgres"), in which case the file is staged for import instead — so only
            // the direct-publish path produces addLayer commands.
            const uploadObs = file
                ? Rx.Observable.fromPromise(
                    isRasterFile(file)
                        ? uploadGeoTiffApi(file)
                        : wantsPostgisImport(message)
                            ? uploadGeoPackageToPostgisApi(file)
                            : uploadGeoPackageApi(file, fileToStoreName(file), fileToStoreName(file))
                ).map((uploadResponse) => {
                    const uploadContext =
                        '\n\n[File attached: ' + file.name + ']\n' +
                        'Upload result: ' + uploadResponse.message;
                    return {
                        enrichedMessage: (message || 'I attached a file.') + uploadContext,
                        uploadCommands: uploadResponse.commands || []
                    };
                })
                : Rx.Observable.of({ enrichedMessage: message, uploadCommands: [] });

            return uploadObs
                .catch((err) =>
                    Rx.Observable.of({
                        enrichedMessage: (message || '') +
                            '\n\n[File upload failed: ' + (err.message || 'unknown error') + ']',
                        uploadCommands: []
                    })
                )
                .switchMap(({ enrichedMessage, uploadCommands }) =>
                    Rx.Observable.fromPromise(queryAI({ message: enrichedMessage, mapContext, sessionId }))
                        .switchMap((response) => {
                            const commandActions = dispatchCommands([
                                ...uploadCommands,
                                ...(response.commands || [])
                            ]);
                            return Rx.Observable.from([
                                receiveResponse(response.message || ''),
                                ...commandActions
                            ]);
                        })
                        .catch((err) =>
                            Rx.Observable.of(setError(err.message || 'Request failed'))
                        )
                );
        });

export default { sendMessageEpic };
