/**
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Actions for background selector
 * @name actions.backgroundselector
 */

export const ADD_BACKGROUND = 'ADD_BACKGROUND';
export const REMOVE_BACKGROUND = 'REMOVE_BACKGROUND';
export const SET_CURRENT_BACKGROUND_LAYER = 'SET_CURRENT_BACKGROUND_LAYER';
export const BACKGROUND_ADDED = 'BACKGROUND_ADDED';
export const BACKGROUND_EDITED = 'BACKGROUND_EDITED';
export const ADD_BACKGROUND_PROPERTIES = 'ADD_BACKGROUND_PROPERTIES';
export const SET_BACKGROUND_MODAL_PARAMS = 'SET_BACKGROUND_MODAL_PARAMS';
export const UPDATE_BACKGROUND_THUMBNAIL = 'UPDATE_BACKGROUND_THUMBNAIL';
export const BACKGROUNDS_CLEAR = 'BACKGROUNDS_CLEAR';
export const CREATE_BACKGROUNDS_LIST = 'CREATE_BACKGROUNDS_LIST';
export const CLEAR_MODAL_PARAMETERS = 'CLEAR_MODAL_PARAMETERS';
export const CONFIRM_DELETE_BACKGROUND_MODAL = 'CONFIRM_DELETE_BACKGROUND_MODAL';
export const ALLOW_BACKGROUNDS_DELETION = 'ALLOW_BACKGROUNDS_DELETION';

export function createBackgroundsList(backgrounds) {
    return {
        type: CREATE_BACKGROUNDS_LIST,
        backgrounds
    };
}

export function addBackground(source) {
    return {
        type: ADD_BACKGROUND,
        source: source
    };
}

export function addBackgroundProperties(modalParams) {
    return {
        type: ADD_BACKGROUND_PROPERTIES,
        modalParams
    };
}

export function setBackgroundModalParams(modalParams) {
    return {
        type: SET_BACKGROUND_MODAL_PARAMS,
        modalParams
    };
}

export function backgroundAdded(layerId) {
    return {
        type: BACKGROUND_ADDED,
        layerId
    };
}

export function backgroundEdited(layerId) {
    return {
        type: BACKGROUND_EDITED,
        layerId
    };
}

export function setCurrentBackgroundLayer(layerId) {
    return {
        type: SET_CURRENT_BACKGROUND_LAYER,
        layerId
    };
}

export function allowBackgroundsDeletion(allow) {
    return {
        type: ALLOW_BACKGROUNDS_DELETION,
        allow
    };
}

export function updateThumbnail(thumbnailData, backgroundId) {
    return {
        type: UPDATE_BACKGROUND_THUMBNAIL,
        thumbnailData,
        id: backgroundId
    };
}

export function removeBackground(backgroundId) {
    return {
        type: REMOVE_BACKGROUND,
        backgroundId
    };
}

export function clearBackgrounds() {
    return {
        type: BACKGROUNDS_CLEAR
    };
}

export function clearModalParameters() {
    return {
        type: CLEAR_MODAL_PARAMETERS
    };
}

export function confirmDeleteBackgroundModal(show, layerTitle = null, layerId = null) {
    return {
        type: CONFIRM_DELETE_BACKGROUND_MODAL,
        show,
        layerTitle,
        layerId
    };
}
