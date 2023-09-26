import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import Editor from './Editor';
import EditorTheme from './themes/EditorTheme';
import EditorNodes from './nodes/EditorNodes';

function App() {
  const initialConfig = {
    namespace: 'ScriboMD',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <LexicalComposer initialConfig={initialConfig}>
          <Editor />
        </LexicalComposer>
      </header>
    </div>
  );
}

export default App;
