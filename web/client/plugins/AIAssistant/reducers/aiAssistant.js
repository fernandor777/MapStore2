import uuidv1 from 'uuid/v1';
import {
    SEND_MESSAGE,
    RECEIVE_RESPONSE,
    SET_LOADING,
    SET_ERROR,
    CLEAR_CHAT,
    TOGGLE_PANEL
} from '../actions/aiAssistant';

const initialState = {
    messages: [],
    loading: false,
    error: null,
    open: false,
    // Identifies this chat's server-side ChatMemory so the assistant recalls prior turns
    // (e.g. a GeoTIFF filename staged earlier). Regenerated whenever the chat is cleared.
    sessionId: uuidv1()
};

export default function aiAssistant(state = initialState, action) {
    switch (action.type) {
    case SEND_MESSAGE:
        return {
            ...state,
            messages: [...state.messages, { role: 'user', text: action.message }],
            loading: true,
            error: null
        };
    case RECEIVE_RESPONSE:
        return {
            ...state,
            messages: [...state.messages, { role: 'assistant', text: action.text }],
            loading: false
        };
    case SET_LOADING:
        return { ...state, loading: action.loading };
    case SET_ERROR:
        return { ...state, loading: false, error: action.error };
    case CLEAR_CHAT:
        return { ...state, messages: [], error: null, sessionId: uuidv1() };
    case TOGGLE_PANEL:
        return { ...state, open: !state.open };
    default:
        return state;
    }
}
