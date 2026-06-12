import Rx from 'rxjs';
import { SEND_MESSAGE, receiveResponse, setError } from '../actions/aiAssistant';
import { queryAI } from '../api/aiService';
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

export default { sendMessageEpic };
