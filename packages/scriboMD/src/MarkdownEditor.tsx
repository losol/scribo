import React, { useMemo } from 'react';
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import MarkdownEditorTheme from './themes/MarkdownEditorTheme';
import Editor from './Editor';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChanged: (markdown: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = () => {
  const [isLinkEditMode, setIsLinkEditMode] = React.useState(false);

  const initialConfig = {
    namespace: 'Playground',
    onError: (error: Error) => {
      throw error;
    },
    theme: MarkdownEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className='editor-shell'>
        <Editor />
      </div>
    </LexicalComposer>
  );
};
export default MarkdownEditor;
