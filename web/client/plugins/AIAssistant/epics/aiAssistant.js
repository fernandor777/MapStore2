import Rx from 'rxjs';
import { SEND_MESSAGE, UPLOAD_GEOPACKAGE, receiveResponse, setError } from '../actions/aiAssistant';
import { queryAI, uploadGeoPackage as uploadGeoPackageApi } from '../api/aiService';
import { buildMapContext } from '../utils/mapContextBuilder';
import { dispatchCommands } from '../utils/commandDispatcher';

export const sendMessageEpic = (action$, store) =>
    action$.ofType(SEND_MESSAGE)
        .switchMap(({ message }) => {
            const state = store.getState();
            const mapContext = buildMapContext(state);
            return Rx.Observable.fromPromise(queryAI({ message, mapContext }))
                .switchMap((response) => {
                    const commandActions = dispatchCommands(response.commands);
                    return Rx.Observable.from([
                        receiveResponse(response.message || ''),
                        ...commandActions
                    ]);
                })
                .catch((err) =>
                    Rx.Observable.of(setError(err.message || 'Request failed'))
                );
        });

export const uploadGeoPackageEpic = (action$) =>
    action$.ofType(UPLOAD_GEOPACKAGE)
        .switchMap(({ file, workspace, storeName }) =>
            Rx.Observable.fromPromise(uploadGeoPackageApi(file, workspace, storeName))
                .switchMap((response) => {
                    const commandActions = dispatchCommands(response.commands || []);
                    return Rx.Observable.from([
                        receiveResponse(response.message || ''),
                        ...commandActions
                    ]);
                })
                .catch((err) =>
                    Rx.Observable.of(setError(err.message || 'Upload failed'))
                )
        );

export default { sendMessageEpic, uploadGeoPackageEpic };
