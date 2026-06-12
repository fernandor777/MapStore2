import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Panel, Glyphicon, Button } from 'react-bootstrap';
import { mapLayoutValuesSelector } from '../../selectors/maplayout';
import { setControlProperty } from '../../actions/controls';
import { sendMessage, clearChat } from './actions/aiAssistant';
import ChatPanel from './components/ChatPanel';

function AIAssistantPanel({ active, messages, loading, error, dockStyle, onSend, onClear, onClose }) {
    if (!active) {
        return null;
    }
    return (
        <Panel
            style={{
                position: 'absolute',
                right: dockStyle.right || 0,
                top: dockStyle.top || 0,
                bottom: dockStyle.bottom || 0,
                width: 340,
                zIndex: 1000,
                margin: 0,
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-2px 0 8px rgba(0,0,0,0.15)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 8px 0' }}>
                <Button bsSize="xsmall" bsStyle="link" onClick={onClose} title="Close">
                    <Glyphicon glyph="1-close" />
                </Button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <ChatPanel
                    messages={messages}
                    loading={loading}
                    error={error}
                    onSend={onSend}
                    onClear={onClear}
                />
            </div>
        </Panel>
    );
}

AIAssistantPanel.propTypes = {
    active: PropTypes.bool,
    messages: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.string,
    dockStyle: PropTypes.object,
    onSend: PropTypes.func,
    onClear: PropTypes.func,
    onClose: PropTypes.func
};

AIAssistantPanel.defaultProps = {
    active: false,
    messages: [],
    loading: false,
    error: null,
    dockStyle: {},
    onSend: () => {},
    onClear: () => {},
    onClose: () => {}
};

const mapStateToProps = (state) => ({
    active: !!(state.controls && state.controls['ai-assistant'] && state.controls['ai-assistant'].enabled),
    messages: state.aiAssistant ? state.aiAssistant.messages : [],
    loading: state.aiAssistant ? state.aiAssistant.loading : false,
    error: state.aiAssistant ? state.aiAssistant.error : null,
    dockStyle: mapLayoutValuesSelector(state, { right: true, bottom: true, top: true })
});

const mapDispatchToProps = {
    onSend: sendMessage,
    onClear: clearChat,
    onClose: setControlProperty.bind(null, 'ai-assistant', 'enabled', false)
};

export default connect(mapStateToProps, mapDispatchToProps)(AIAssistantPanel);
