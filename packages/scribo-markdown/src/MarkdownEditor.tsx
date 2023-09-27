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
  onChange?: (markdown: string) => void;
}

function MarkdownEditor(props: EditorComposerProps) {
  const [markdownOutput, setMarkdownOutput] = useState<string>('');

  const internalOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      props.onChange && props.onChange(markdown);
    });
  };

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
        <Editor onChange={internalOnChange} />
      </div>
    </LexicalComposer>
  );
}

export default MarkdownEditor;
