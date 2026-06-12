import { layersSelector } from '../../../selectors/layers';
import { mapSelector, projectionSelector, currentZoomLevelSelector } from '../../../selectors/map';

export function buildMapContext(state) {
    const map = mapSelector(state) || {};
    const layers = layersSelector(state) || [];
    return {
        zoom: currentZoomLevelSelector(state),
        centerX: map.center ? map.center.x : 0,
        centerY: map.center ? map.center.y : 0,
        projection: projectionSelector(state) || 'EPSG:4326',
        layers: layers
            .filter((l) => l && l.group !== 'background')
            .map((l) => ({
                id: l.id,
                name: l.name,
                title: l.title || l.name,
                visible: l.visibility !== false,
                style: l.styles || l.style || null,
                type: l.type || 'wms'
            })),
        selectedLayerId: null
    };
}
