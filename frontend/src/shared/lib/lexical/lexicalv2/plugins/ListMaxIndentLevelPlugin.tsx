import { $getListDepth, $isListItemNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isElementNode, $isRangeSelection, COMMAND_PRIORITY_HIGH, INDENT_CONTENT_COMMAND } from 'lexical';
import { useEffect } from 'react';

//@ts-ignore
function getElementNodesInSelection(selection) {
    const nodesInSelection = selection.getNodes();

    if (nodesInSelection.length === 0) {
        return new Set([selection.anchor.getNode().getParentOrThrow(), selection.focus.getNode().getParentOrThrow()]);
    }
    //@ts-ignore
    return new Set(nodesInSelection.map((n) => ($isElementNode(n) ? n : n.getParentOrThrow())));
}
//@ts-ignore

function isIndentPermitted(maxDepth) {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
        return false;
    }

    const elementNodesInSelection = getElementNodesInSelection(selection);

    let totalDepth = 0;

    // @ts-ignore
    for (const elementNode of elementNodesInSelection) {
        if ($isListNode(elementNode)) {
            totalDepth = Math.max($getListDepth(elementNode) + 1, totalDepth);
        } else if ($isListItemNode(elementNode)) {
            const parent = elementNode.getParent();
            if (!$isListNode(parent)) {
                throw new Error('ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.');
            }

            totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
        }
    }

    return totalDepth <= maxDepth;
}
//@ts-ignore
export default function ListMaxIndentLevelPlugin({ maxDepth }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerCommand(INDENT_CONTENT_COMMAND, () => !isIndentPermitted(maxDepth ?? 7), COMMAND_PRIORITY_HIGH), [editor, maxDepth]);

    return null;
}
