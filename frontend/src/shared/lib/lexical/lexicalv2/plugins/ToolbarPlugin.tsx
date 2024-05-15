import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import ArrowClockWise from '@/shared/icons/editor/ArrowClockWise';
import ArrowCounterClockWise from '@/shared/icons/editor/ArrowCounterClockWise';
import ExpandMore from '@/shared/icons/editor/ExpandMore';
import FormatBold from '@/shared/icons/editor/FormatBold';
import FormatCenter from '@/shared/icons/editor/FormatCenter';
import FormatItalic from '@/shared/icons/editor/FormatItalic';
import FormatLeft from '@/shared/icons/editor/FormatLeft';
import FormatRight from '@/shared/icons/editor/FormatRight';
import FormatStrikethrough from '@/shared/icons/editor/FormatStrikethrough';
import FormatUnderlined from '@/shared/icons/editor/FormatUnderlined';
import Justify from '@/shared/icons/editor/Justify';
import ParagraphIcon from '@/shared/icons/editor/ParagraphIcon';
import NumberedList from '@/shared/icons/editor/NumberedList';

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'h1', 'h2', 'ul', 'ol']);

const blockTypeToBlockName = {
    h1: 'H1',
    h2: 'H2',
    h3: 'H3',
    h4: 'H4',
    h5: 'H5',
    ol: 'Нум.список',
    paragraph: 'Обычный',
    quote: 'Цитата',
    ul: 'Ненум.список',
};

function Divider() {
    return <div className="divider" />;
}

// function positionEditorElement(editor, rect) {
//     if (rect === null) {
//         editor.style.opacity = '0';
//         editor.style.top = '-1000px';
//         editor.style.left = '-1000px';
//     } else {
//         editor.style.opacity = '1';
//         editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
//         editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
//     }
// }

// function FloatingLinkEditor({ editor }) {
//     const editorRef = useRef(null);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const mouseDownRef = useRef(false);
//     const [linkUrl, setLinkUrl] = useState('');
//     const [isEditMode, setEditMode] = useState(false);
//     const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);
//
//     const updateLinkEditor = useCallback(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//             const node = getSelectedNode(selection);
//             const parent = node.getParent();
//             if ($isLinkNode(parent)) {
//                 setLinkUrl(parent.getURL());
//             } else if ($isLinkNode(node)) {
//                 setLinkUrl(node.getURL());
//             } else {
//                 setLinkUrl('');
//             }
//         }
//         const editorElem = editorRef.current;
//         const nativeSelection = window.getSelection();
//         const activeElement = document.activeElement;
//
//         if (editorElem === null) {
//             return;
//         }
//
//         const rootElement = editor.getRootElement();
//         if (selection !== null && !nativeSelection!.isCollapsed && rootElement !== null && rootElement.contains(nativeSelection!.anchorNode)) {
//             const domRange = nativeSelection!.getRangeAt(0);
//             let rect;
//             if (nativeSelection!.anchorNode === rootElement) {
//                 let inner = rootElement;
//                 while (inner.firstElementChild != null) {
//                     inner = inner.firstElementChild;
//                 }
//                 rect = inner.getBoundingClientRect();
//             } else {
//                 rect = domRange.getBoundingClientRect();
//             }
//
//             if (!mouseDownRef.current) {
//                 positionEditorElement(editorElem, rect);
//             }
//             setLastSelection(selection);
//         } else if (!activeElement || activeElement.className !== 'link-input') {
//             positionEditorElement(editorElem, null);
//             setLastSelection(null);
//             setEditMode(false);
//             setLinkUrl('');
//         }
//
//         return true;
//     }, [editor]);
//
//     useEffect(() => {
//         return mergeRegister(
//             editor.registerUpdateListener(({ editorState }) => {
//                 editorState.read(() => {
//                     updateLinkEditor();
//                 });
//             }),
//
//             editor.registerCommand(
//                 SELECTION_CHANGE_COMMAND,
//                 () => {
//                     updateLinkEditor();
//                     return true;
//                 },
//                 LowPriority
//             )
//         );
//     }, [editor, updateLinkEditor]);
//
//     useEffect(() => {
//         editor.getEditorState().read(() => {
//             updateLinkEditor();
//         });
//     }, [editor, updateLinkEditor]);
//
//     useEffect(() => {
//         if (isEditMode && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [isEditMode]);
//
//     return (
//         <div ref={editorRef} className="link-editor">
//             {isEditMode ? (
//                 <div className="link-input">
//                     <input
//                         ref={inputRef}
//                         value={linkUrl}
//                         onChange={(event) => {
//                             setLinkUrl(event.target.value);
//                         }}
//                         onKeyDown={(event) => {
//                             if (event.key === 'Enter') {
//                                 event.preventDefault();
//                                 if (lastSelection !== null) {
//                                     if (linkUrl !== '') {
//                                         editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
//                                     }
//                                     setEditMode(false);
//                                 }
//                             } else if (event.key === 'Escape') {
//                                 event.preventDefault();
//                                 setEditMode(false);
//                             }
//                         }}
//                     />
//                     <Check
//                         className="cursor-pointer"
//                         onClick={() => {
//                             if (lastSelection !== null) {
//                                 if (linkUrl !== '') {
//                                     editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
//                                 }
//                                 setEditMode(false);
//                             }
//                         }}
//                     />
//                 </div>
//             ) : (
//                 <div className="link-input">
//                     <a href={linkUrl} target="_blank" rel="noopener noreferrer">
//                         {linkUrl}
//                     </a>
//                     {/*<p>{linkUrl}</p>*/}
//                     <Edit
//                         className="link-edit cursor-pointer"
//                         color="primary"
//                         role="button"
//                         tabIndex={0}
//                         onMouseDown={(event) => event.preventDefault()}
//                         onClick={() => {
//                             setEditMode(true);
//                         }}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

// function getSelectedNode(selection) {
//     const anchor = selection.anchor;
//     const focus = selection.focus;
//     const anchorNode = selection.anchor.getNode();
//     const focusNode = selection.focus.getNode();
//     if (anchorNode === focusNode) {
//         return anchorNode;
//     }
//     const isBackward = selection.isBackward();
//     if (isBackward) {
//         return $isAtNodeEnd(focus) ? anchorNode : focusNode;
//     } else {
//         return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
//     }
// }
//@ts-ignore
function BlockOptionsDropdownList({ editor, blockType, toolbarRef, setShowBlockOptionsDropDown }) {
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const toolbar = toolbarRef.current;
        const dropDown = dropDownRef.current;

        if (toolbar !== null && dropDown !== null) {
            const { top, left } = toolbar.getBoundingClientRect();
            dropDown.style.top = `${top + 40}px`;
            dropDown.style.left = `${left}px`;
        }
    }, [dropDownRef, toolbarRef]);

    useEffect(() => {
        const dropDown = dropDownRef.current;
        const toolbar = toolbarRef.current;

        if (dropDown === null || toolbar === null) return;
        //@ts-ignore
        const handle = (event) => {
            const { target } = event;

            if (!dropDown.contains(target) && !toolbar.contains(target)) {
                setShowBlockOptionsDropDown(false);
            }
        };
        document.addEventListener('click', handle);

        return () => {
            document.removeEventListener('click', handle);
        };
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
    //@ts-ignore
    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatLargeHeading = () => {
        if (blockType !== 'h1') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h1'));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatSmallHeading = () => {
        if (blockType !== 'h2') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h2'));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatBulletList = () => {
        if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatNumberedList = () => {
        if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    return (
        <div className="dropdown" ref={dropDownRef}>
            <button type="button" className="item" onClick={formatParagraph}>
                <ParagraphIcon />
                {/*<span>p</span>*/}
                <span className="text">{blockTypeToBlockName['paragraph']}</span>
                {blockType === 'paragraph' && <span className="active" />}
            </button>
            <button type="button" className="item" onClick={formatLargeHeading}>
                {/*<TextH1 />*/}
                <span className="text">{blockTypeToBlockName['h1']}</span>
                {blockType === 'h1' && <span className="active" />}
            </button>
            <button type="button" className="item" onClick={formatSmallHeading}>
                {/*<TextH2 />*/}
                <span className="text">{blockTypeToBlockName['h2']}</span>
                {blockType === 'h2' && <span className="active" />}
            </button>
            <button type="button" className="item" onClick={formatBulletList}>
                <NumberedList />
                {/*<span>l</span>*/}
                <span className="text">{blockTypeToBlockName['ul']}</span>
                {blockType === 'ul' && <span className="active" />}
            </button>
            <button type="button" className="item" onClick={formatNumberedList}>
                {/*<BulletList />*/}
                <span>b</span>
                <span className="text">{blockTypeToBlockName['ol']}</span>
                {blockType === 'ol' && <span className="active" />}
            </button>
            <button type="button" className="item" onClick={formatQuote}>
                {/*<ChatSquareQuote />*/}
                <span>c</span>
                <span className="text">{blockTypeToBlockName['quote']}</span>
                {blockType === 'quote' && <span className="active" />}
            </button>
        </div>
    );
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState('paragraph');
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
    // const [isLink, setIsLink] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    setBlockType(type);
                }
            }
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));

            // Update links
            // const node = getSelectedNode(selection);
            // const parent = node.getParent();
            // if ($isLinkNode(parent) || $isLinkNode(node)) {
            // setIsLink(true);
            // setIsLink(false);
            // } else {
            //     setIsLink(false);
            // }
        }
    }, [editor]);

    useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(({ editorState }) => {
                    editorState.read(() => {
                        updateToolbar();
                    });
                }),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    (_payload) => {
                        updateToolbar();
                        return false;
                    },
                    LowPriority,
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                        setCanUndo(payload);
                        return false;
                    },
                    LowPriority,
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                        setCanRedo(payload);
                        return false;
                    },
                    LowPriority,
                ),
            ),
        [editor, updateToolbar],
    );

    // const insertLink = useCallback(() => {
    //     if (!isLink) {
    //         editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    //     } else {
    //         editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    //     }
    // }, [editor, isLink]);

    return (
        <div className="toolbar" ref={toolbarRef}>
            <button
                type="button"
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, null as any);
                }}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <ArrowCounterClockWise />
            </button>
            <button
                type="button"
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, null as any);
                }}
                className="toolbar-item"
                aria-label="Redo"
            >
                <ArrowClockWise />
            </button>
            <Divider />
            {supportedBlockTypes.has(blockType) && (
                <>
                    <button type="button" className="toolbar-item block-controls" onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}>
                        {/*//@ts-ignore*/}
                        <span className="text">{blockTypeToBlockName[blockType]}</span>
                        <ExpandMore />
                    </button>
                    {showBlockOptionsDropDown &&
                        createPortal(
                            <BlockOptionsDropdownList
                                editor={editor}
                                blockType={blockType}
                                toolbarRef={toolbarRef}
                                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                            />,
                            document.body,
                        )}
                    <Divider />
                </>
            )}

            <>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                    }}
                    className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
                    aria-label="Format Bold"
                >
                    <FormatBold />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                    }}
                    className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
                    aria-label="Format Italics"
                >
                    <FormatItalic />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                    }}
                    className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
                    aria-label="Format Underline"
                >
                    <FormatUnderlined />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                    }}
                    className={`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`}
                    aria-label="Format Strikethrough"
                >
                    <FormatStrikethrough />
                </button>
                {/*<button type="button" onClick={insertLink} className={'toolbar-item spaced ' + (isLink ? 'active' : '')} aria-label="Insert Link">*/}
                {/*    <FormatLink />*/}
                {/*</button>*/}
                {/*{isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}*/}
                <Divider />
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                    }}
                    className="toolbar-item spaced"
                    aria-label="Left Align"
                >
                    <FormatLeft />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                    }}
                    className="toolbar-item spaced"
                    aria-label="Center Align"
                >
                    <FormatCenter />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                    }}
                    className="toolbar-item spaced"
                    aria-label="Right Align"
                >
                    <FormatRight />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                    }}
                    className="toolbar-item"
                    aria-label="Justify Align"
                >
                    <Justify />
                </button>{' '}
            </>
        </div>
    );
}
