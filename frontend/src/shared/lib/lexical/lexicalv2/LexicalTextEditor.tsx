import { CodeNode } from '@lexical/code';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { $getRoot, type EditorState, type LexicalEditor } from 'lexical';
import { forwardRef } from 'react';

import editorTheme from './EditorTheme';
import './EditorTheme.css';
// import AutoLinkPlugin from './ui/plugins/AutoLinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
// import ToolbarPlugin from './plugins/ToolbarPlugin';
import { P } from '@/shared/ui/typography';
import { cn } from '@/lib/utils';
import ToolbarPlugin from '@/shared/lib/lexical/lexicalv2/plugins/ToolbarPlugin';

function Placeholder({ text = 'Все с чего-то начинается...' }: { text?: string }) {
    return (
        <P style={{ margin: 0 }} className="editor-placeholder m-0 text-muted-foreground">
            {text}
        </P>
    );
}

export interface LexicalTextEditorProps {
    onChange: (value: string) => void;
    defaultValue?: string;
    error?: string;
    placeholder?: string;
}

export const LexicalTextEditor = forwardRef<any, LexicalTextEditorProps>((props, ref) => {
    const { onChange, defaultValue, error, placeholder } = props;

    const editorConfig = {
        namespace: 'TextEditor',
        theme: editorTheme,
        onError(error) {
            throw error;
        },
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, TableNode, CodeNode, TableCellNode, TableRowNode, AutoLinkNode, LinkNode],
        editorState: (editor) => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(defaultValue ?? '', 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            //todo unsafe
            // const paragraphNode = $createParagraphNode();
            //
            nodes.forEach((n) => root.append(n));
            //
            // root.append(paragraphNode);  const paragraphNode = $createParagraphNode();
        },
    } satisfies InitialConfigType;

    const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor, null);
            onChange(html);
        });
    };

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={cn('editor-container', { error })}>
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder text={placeholder} />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    {/*<CodeHighlightPlugin />*/}

                    {/*<LinkPlugin />*/}
                    {/*<AutoLinkPlugin matchers={} />*/}
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <EditorRefPlugin editorRef={ref as any} />
                    <OnChangePlugin onChange={handleChange}></OnChangePlugin>
                </div>
            </div>
            <P className="text-destructive">{error}</P>
        </LexicalComposer>
    );
});
