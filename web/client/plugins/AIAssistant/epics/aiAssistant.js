import Rx from 'rxjs';
import { SEND_MESSAGE, receiveResponse, setError } from '../actions/aiAssistant';
import { queryAI, uploadGeoPackage as uploadGeoPackageApi } from '../api/aiService';
import { buildMapContext } from '../utils/mapContextBuilder';
import { dispatchCommands } from '../utils/commandDispatcher';

function fileToStoreName(file) {
    return file.name.replace(/\.gpkg$/i, '').replace(/[^a-zA-Z0-9_]/g, '_') || 'gpkg_store';
}

export const sendMessageEpic = (action$, store) =>
    action$.ofType(SEND_MESSAGE)
        .switchMap(({ message, file }) => {
            const state = store.getState();
            const mapContext = buildMapContext(state);

            // When a file is attached: upload it first, then call the AI with
            // the upload result as additional context alongside the user's message.
            const uploadObs = file
                ? Rx.Observable.fromPromise(
                    uploadGeoPackageApi(file, fileToStoreName(file), fileToStoreName(file))
                ).map((uploadResponse) => {
                    const uploadContext =
                        '\n\n[File attached: ' + file.name + ']\n' +
                        'Upload result: ' + uploadResponse.message;
                    return {
                        enrichedMessage: (message || 'I attached a GeoPackage file.') + uploadContext,
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
                    Rx.Observable.fromPromise(queryAI({ message: enrichedMessage, mapContext }))
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
