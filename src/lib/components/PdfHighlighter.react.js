import PropTypes from 'prop-types';
import 'react-pdf-highlighter/dist/style.css';
import React, {useState, useEffect, useRef} from 'react';

import {
    AreaHighlight,
    Highlight,
    PdfLoader,
    Popup,
    Tip,
    Content,
    PdfHighlighter as _PdfHighlighter,
} from 'react-pdf-highlighter';

// Simple tip component that appears when selecting text
const YourCustomTip = ({onConfirm}) => (
    <Tip
        onOpen={() => {}}
        onConfirm={(text) => {
            onConfirm(text);
        }}
    />
);

const PdfHighlighter = (props) => {
    const {id, setProps, style, src, highlights: propHighlights} = props;

    const [highlights, setHighlights] = useState(propHighlights || []);
    const highlighterRef = useRef(null);

    // keep local state in sync with Dash prop
    useEffect(() => {
        setHighlights(propHighlights || []);
    }, [propHighlights]);

    const addHighlight = (highlight) => {
        const newHighlights = [...highlights, highlight];
        setHighlights(newHighlights);
        // Send updated highlights back to Dash
        setProps?.({highlights: newHighlights});
    };

    return (
        <div id={id} style={style}>
            <PdfLoader document={src}>
                {(pdfDocument) => (
                    <_PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection={(event) => event.altKey}
                        selectionTip={(props) => <YourCustomTip {...props} />}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection
                        ) => {
                            const newHighlight = {
                                content,
                                position,
                                id: String(Math.random()).slice(2),
                            };
                            addHighlight(newHighlight);
                            hideTipAndSelection();
                        }}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo
                        ) => {
                            const isTextHighlight = !highlight.content?.image;
                            const component = isTextHighlight ? (
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={highlight.comment}
                                />
                            ) : (
                                <AreaHighlight
                                    highlight={highlight}
                                    onChange={(boundingRect) => {
                                        setHighlights((prev) =>
                                            prev.map((h) =>
                                                h.id === highlight.id
                                                    ? {
                                                          ...h,
                                                          position: {
                                                              boundingRect,
                                                          },
                                                      }
                                                    : h
                                            )
                                        );
                                    }}
                                />
                            );

                            return (
                                <Popup
                                    popupContent={
                                        <Content>
                                            {highlight.comment?.text}
                                        </Content>
                                    }
                                    onMouseOver={(popupContent) =>
                                        setTip(popupContent)
                                    }
                                    onMouseOut={hideTip}
                                >
                                    {component}
                                </Popup>
                            );
                        }}
                        highlights={highlights}
                        utilsRef={(ref) => {
                            highlighterRef.current = ref;
                        }}
                    />
                )}
            </PdfLoader>
        </div>
    );
};

PdfHighlighter.defaultProps = {
    highlights: [],
    style: {height: '100vh', width: '100%'},
};

PdfHighlighter.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * List of highlights stored in Dash state.
     */
    highlights: PropTypes.array,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    /**
     * The URL of the PDF document to be displayed.
     */
    src: PropTypes.string.isRequired,

    /**
     * Style object to pass to the container div.
     */
    style: PropTypes.object,
};

export default PdfHighlighter;
