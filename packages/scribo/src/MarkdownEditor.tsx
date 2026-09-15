import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $createParagraphNode, $createTextNode, $getRoot, type EditorState } from 'lexical';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import EditorNodes from './nodes/EditorNodes';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import EditorTheme from './themes/EditorTheme';
import type { ScriboPlugin } from './types';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

export type onChangeMisc = {
  plainText: string;
};
export interface MarkdownEditorProps {
  initialMarkdown?: string;
  className?: string;
  plugins?: ScriboPlugin[];
  onChange?: (markdown: string, misc: onChangeMisc) => void;
  onBlur?: () => void;
  placeholder?: string;
  'data-testid'?: string;
  id?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { historyState } = useSharedHistoryContext();
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | undefined>(
    undefined
  );

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  // Collect nodes and transformers from plugins
  const pluginNodes = useMemo(
    () => (props.plugins ?? []).flatMap((p) => p.nodes ?? []),
    [props.plugins]
  );
  const allTransformers = useMemo(
    () => [...(props.plugins ?? []).flatMap((p) => p.transformers ?? []), ...TRANSFORMERS],
    [props.plugins]
  );
  const toolbarButtons = useMemo(
    () => (props.plugins ?? []).flatMap((p) => p.toolbarButtons ?? []),
    [props.plugins]
  );
  const editorPlugins = useMemo(
    () => (props.plugins ?? []).flatMap((p) => p.editorPlugins ?? []),
    [props.plugins]
  );

  const internalOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(allTransformers);
      const plainText = $getRoot().getTextContent();
      props.onChange?.(markdown, { plainText });
    });
  };

  const initialConfig = {
    namespace: 'ScriboMarkdown',
    nodes: [...EditorNodes, ...pluginNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
    editorState: props.initialMarkdown
      ? () => {
          // Unescape backslash-escaped markdown characters
          const unescapedMarkdown = (props.initialMarkdown ?? '').replaceAll(
            /\\([*_`[\]()#+-])/g,
            '$1'
          );
          try {
            $convertFromMarkdownString(unescapedMarkdown, allTransformers);
          } catch (err) {
            // Markdown parsing threw (e.g. a transformer bug). Fall back to plain
            // text so the field stays editable and content isn't lost — better
            // than crashing the whole tree and propagating to the page boundary.
            console.error('Scribo: markdown parse failed, falling back to plain text', err);
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(unescapedMarkdown));
            root.append(paragraph);
          }
        }
      : undefined,
  };

  return (
    <div className={props.className}>
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className="editor-shell"
          onBlur={props.onBlur}
          data-testid={props['data-testid']}
          id={props.id}
        >
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} toolbarButtons={toolbarButtons} />
          <div className="editor-container rich-text">
            <HistoryPlugin externalHistoryState={historyState} />
            <MarkdownShortcutPlugin transformers={allTransformers} />
            <AutoLinkPlugin />
            <LinkPlugin />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div
                    className="editor"
                    ref={onRef}
                    id={props.id ? `${props.id}-editable` : undefined}
                  >
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={<Placeholder>{props.placeholder}</Placeholder>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          {props.onChange && <OnChangePlugin onChange={internalOnChange} />}
          {editorPlugins.map((Plugin) => (
            <Plugin key={Plugin.displayName ?? Plugin.name} />
          ))}
        </div>
      </LexicalComposer>
    </div>
  );
};

export default MarkdownEditor;
