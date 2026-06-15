import { layersSelector, rawGroupsSelector } from '../../../selectors/layers';
import { mapSelector, projectionSelector, currentZoomLevelSelector } from '../../../selectors/map';

export function buildMapContext(state) {
    const map = mapSelector(state) || {};
    const layers = layersSelector(state) || [];
    const rawGroups = rawGroupsSelector(state) || [];

    // Collect unique non-background group names for the LLM to reuse
    const groupNames = rawGroups
        .map((g) => g.id || g.name)
        .filter((g) => g && g !== 'background');

    return {
        zoom: currentZoomLevelSelector(state),
        centerX: map.center ? map.center.x : 0,
        centerY: map.center ? map.center.y : 0,
        projection: projectionSelector(state) || 'EPSG:4326',
        groups: groupNames.length > 0 ? groupNames : ['Default'],
        layers: layers
            .filter((l) => l && l.group !== 'background')
            .map((l, i) => ({
                id: l.id,
                name: l.name,
                title: l.title || l.name,
                visible: l.visibility !== false,
                style: l.styles || l.style || null,
                type: l.type || 'wms',
                url: l.url || null,
                group: l.group || 'Default',
                position: i
            })),
        selectedLayerId: null
    };
}
