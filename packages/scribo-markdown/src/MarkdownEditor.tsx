import React, { useState } from 'react';
import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import Editor from './Editor';
import EditorTheme from './themes/EditorTheme';
import EditorNodes from './nodes/EditorNodes';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { EditorState } from 'lexical';

interface EditorComposerProps {
  initialMarkdown?: string;
  onChange?: (editorState: EditorState) => void;
}

function MarkdownEditor(props: EditorComposerProps) {
  const [markdownOutput, setMarkdownOutput] = useState<string>('');

  const initialConfig = {
    namespace: 'ScriboMarkdown',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
    editorState: () => {
      $convertFromMarkdownString(props.initialMarkdown ?? '', TRANSFORMERS);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className='editor-shell'>
        <Editor onChange={props.onChange} />
      </div>
    </LexicalComposer>
  );
}

export default MarkdownEditor;
