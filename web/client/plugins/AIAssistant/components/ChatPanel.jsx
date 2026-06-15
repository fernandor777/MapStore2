import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Glyphicon } from 'react-bootstrap';

function MessageBubble({ role, text }) {
    const isUser = role === 'user';
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 8
            }}
        >
            <div
                style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: isUser ? '#337ab7' : '#f0f0f0',
                    color: isUser ? '#fff' : '#333',
                    fontSize: 13,
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}
            >
                {text}
            </div>
        </div>
    );
}

MessageBubble.propTypes = {
    role: PropTypes.string,
    text: PropTypes.string
};

function ChatPanel({ messages, loading, error, onSend, onClear }) {
    const [input, setInput] = useState('');
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;
        onSend(trimmed);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 8, minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
                <strong style={{ fontSize: 14 }}>AI Map Assistant</strong>
                <Button bsSize="xsmall" bsStyle="link" onClick={onClear} title="Clear chat">
                    <Glyphicon glyph="trash" />
                </Button>
            </div>
            <div
                ref={listRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: 8,
                    padding: '4px 0',
                    minHeight: 0
                }}
            >
                {messages.length === 0 && !loading && (
                    <div style={{ color: '#999', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                        Ask me to show layers, zoom to a place, apply filters, and more.
                    </div>
                )}
                {messages.map((m, i) => (
                    <MessageBubble key={i} role={m.role} text={m.text} />
                ))}
                {loading && (
                    <div style={{ color: '#999', fontSize: 12, padding: '4px 0' }}>
                        <em>Thinking…</em>
                    </div>
                )}
                {error && (
                    <div style={{ color: '#c9302c', fontSize: 12, padding: '4px 0' }}>
                        Error: {error}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <FormControl
                    componentClass="textarea"
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask something about the map…"
                    disabled={loading}
                    style={{ resize: 'none', fontSize: 13 }}
                />
                <Button
                    bsStyle="primary"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    style={{ alignSelf: 'flex-end' }}
                >
                    <Glyphicon glyph="send" />
                </Button>
            </div>
        </div>
    );
}

ChatPanel.propTypes = {
    messages: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.string,
    onSend: PropTypes.func,
    onClear: PropTypes.func
};

ChatPanel.defaultProps = {
    messages: [],
    loading: false,
    error: null,
    onSend: () => {},
    onClear: () => {}
};

export default ChatPanel;
