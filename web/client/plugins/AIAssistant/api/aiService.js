const AI_ENDPOINT = '/mapstore/rest/geostore/ai/query';

export function queryAI({ message, mapContext }) {
    return fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message, mapContext })
    }).then((res) => {
        if (!res.ok) {
            return res.text().then((t) => {
                throw new Error(t || `HTTP ${res.status}`);
            });
        }
        return res.json();
    });
}
