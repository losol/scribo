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

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChanged: (markdown: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent,
  onContentChanged,
}) => {
  const lexicalConfig: InitialConfigType = {
    namespace: 'MarkdownEditor',
    onError: (e) => {
      console.log('ERROR:', e);
    },
  };

  const RichContent = useMemo(() => {
    return (
      <ContentEditable
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          padding: '10px',
        }}
      />
    );
  }, []);

  const Placeholder = useMemo(() => {
    return (
      <div
        style={{
          // position: 'absolute',
          top: '10px',
        }}
      >
        {initialContent || 'Type something...'}
      </div>
    );
  }, [initialContent]);

  return (
    <div style={{ padding: '20px' }}>
      <LexicalComposer initialConfig={lexicalConfig}>
        <RichTextPlugin
          contentEditable={RichContent}
          placeholder={Placeholder}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              onContentChanged(editorState.toJSON().toString());
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
};
export default MarkdownEditor;
