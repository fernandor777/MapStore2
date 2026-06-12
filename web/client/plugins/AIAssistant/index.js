import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { createPlugin } from '../../utils/PluginsUtils';
import { setControlProperty } from '../../actions/controls';
import { burgerMenuSelector } from '../../selectors/controls';
import aiAssistant from './reducers/aiAssistant';
import epics from './epics/aiAssistant';
import AIAssistantPanel from './AIAssistant';
import { togglePanel } from './actions/aiAssistant';

export default createPlugin('AIAssistant', {
    component: AIAssistantPanel,
    containers: {
        BurgerMenu: {
            name: 'ai-assistant',
            position: 30,
            text: 'AI Assistant',
            tooltip: 'AI Map Assistant',
            icon: <Glyphicon glyph="comment" />,
            action: setControlProperty.bind(null, 'ai-assistant', 'enabled', true, true),
            doNotHide: true,
            priority: 2
        },
        SidebarMenu: {
            name: 'ai-assistant',
            position: 30,
            text: 'AI Assistant',
            tooltip: 'AI Map Assistant',
            icon: <Glyphicon glyph="comment" />,
            action: setControlProperty.bind(null, 'ai-assistant', 'enabled', true, true),
            selector: (state) => ({
                style: { display: burgerMenuSelector(state) ? 'none' : null }
            }),
            toggle: true,
            priority: 2,
            doNotHide: true
        }
    },
    reducers: {
        aiAssistant
    },
    epics
});
