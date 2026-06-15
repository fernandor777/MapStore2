import { changeLayerProperties, addLayer, removeLayer, selectNode, moveNode } from '../../../actions/layers';
import { zoomToExtent, changeMapView, panTo } from '../../../actions/map';

const COMMAND_MAP = {
    setLayerVisibility: ({ layerId, visible }) =>
        changeLayerProperties(layerId, { visibility: visible }),
    changeLayerStyle: ({ layerId, styleName }) =>
        changeLayerProperties(layerId, { styles: styleName }),
    changeLayerOpacity: ({ layerId, opacity }) =>
        changeLayerProperties(layerId, { opacity }),
    addLayer: ({ layerConfig }) => {
        const layer = {
            visibility: true,
            opacity: 1,
            group: 'Default',
            ...layerConfig,
            // ensure a unique id so MapStore doesn't silently drop it
            id: layerConfig.id || (layerConfig.name + '__' + Date.now())
        };
        return addLayer(layer, true);
    },
    removeLayer: ({ layerId }) =>
        removeLayer(layerId),
    zoomToExtent: ({ minx, miny, maxx, maxy, crs }) =>
        zoomToExtent([minx, miny, maxx, maxy], crs || 'EPSG:4326'),
    setZoom: ({ zoom }) =>
        changeMapView(null, zoom, null, null, 'ai-assistant'),
    panTo: ({ x, y }) =>
        panTo({ x, y }),
    applyFilter: ({ layerId, cqlFilter }) =>
        changeLayerProperties(layerId, { params: { CQL_FILTER: cqlFilter } }),
    clearFilter: ({ layerId }) =>
        changeLayerProperties(layerId, { params: { CQL_FILTER: undefined } }),
    selectLayer: ({ layerId }) =>
        selectNode(layerId, 'layer', false),
    moveLayer: ({ layerId, groupId, index }) =>
        moveNode(layerId, groupId, index),
    renameLayer: ({ layerId, title }) =>
        changeLayerProperties(layerId, { title }),
    updateLayerParams: ({ layerId, params }) =>
        changeLayerProperties(layerId, { params })
};

export function dispatchCommands(commands = []) {
    return commands
        .map((cmd) => cmd && COMMAND_MAP[cmd.type] && COMMAND_MAP[cmd.type](cmd))
        .filter(Boolean);
}
