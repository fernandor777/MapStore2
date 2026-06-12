export const SEND_MESSAGE = 'AI_ASSISTANT:SEND_MESSAGE';
export const RECEIVE_RESPONSE = 'AI_ASSISTANT:RECEIVE_RESPONSE';
export const SET_LOADING = 'AI_ASSISTANT:SET_LOADING';
export const SET_ERROR = 'AI_ASSISTANT:SET_ERROR';
export const CLEAR_CHAT = 'AI_ASSISTANT:CLEAR_CHAT';
export const TOGGLE_PANEL = 'AI_ASSISTANT:TOGGLE_PANEL';

export const sendMessage = (message) => ({ type: SEND_MESSAGE, message });
export const receiveResponse = (text) => ({ type: RECEIVE_RESPONSE, text });
export const setLoading = (loading) => ({ type: SET_LOADING, loading });
export const setError = (error) => ({ type: SET_ERROR, error });
export const clearChat = () => ({ type: CLEAR_CHAT });
export const togglePanel = () => ({ type: TOGGLE_PANEL });
