import React from 'react';
import MarkdownEditor from './MarkdownEditor';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <MarkdownEditor
          onContentChanged={(content) => console.log(content)}
          initialContent='**Hello** _world_!'
        />
      </header>
    </div>
  );
}

export default App;
