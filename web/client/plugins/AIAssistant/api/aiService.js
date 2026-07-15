const AI_BASE = '/mapstore/rest/geostore/ai';

export function queryAI({ message, mapContext, sessionId }) {
    return fetch(AI_BASE + '/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message, mapContext, sessionId })
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((t) => {
                throw new Error(t || `HTTP ${res.status}`);
            });
        }
        return res.json();
    });
}

export function uploadGeoPackage(file, workspace, storeName) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('workspace', workspace);
    fd.append('storeName', storeName);
    // No Content-Type header — browser sets multipart/form-data with boundary automatically
    return fetch(AI_BASE + '/upload-geopackage', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((t) => {
                throw new Error(t || `HTTP ${res.status}`);
            });
        }
        return res.json();
    });
}

export function uploadGeoTiff(file) {
    const fd = new FormData();
    fd.append('file', file);
    // No Content-Type header — browser sets multipart/form-data with boundary automatically
    return fetch(AI_BASE + '/upload-geotiff', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((t) => {
                throw new Error(t || `HTTP ${res.status}`);
            });
        }
        return res.json();
    });
}

export function uploadGeoPackageToPostgis(file) {
    const fd = new FormData();
    fd.append('file', file);
    // No Content-Type header — browser sets multipart/form-data with boundary automatically
    return fetch(AI_BASE + '/upload-geopackage-postgis', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((t) => {
                throw new Error(t || `HTTP ${res.status}`);
            });
        }
        return res.json();
    });
}
