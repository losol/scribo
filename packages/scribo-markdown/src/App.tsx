import React, { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { EditorState } from 'lexical';

function App() {
  const [markdownOutput, setMarkdownOutput] = useState<string>('');
  const initalMarkdown = `Hello **markdown**!`;

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      setMarkdownOutput(markdown);
    });
  };

  return (
    <div className='App'>
      <h1>Markdown editor</h1>
      <h2>Make some content</h2>
      <MarkdownEditor onChange={onChange} initialMarkdown={initalMarkdown} />
      <h2>Markdown output</h2>
      <pre>{markdownOutput}</pre>
    </div>
  );
}

export default App;
