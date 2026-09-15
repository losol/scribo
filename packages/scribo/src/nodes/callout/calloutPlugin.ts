import { $findMatchingParent } from '@lexical/utils';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';

import type { ScriboPlugin } from '../../types';
import { CalloutPlugin } from './CalloutComponent';
import { $createCalloutNode, CalloutNode } from './CalloutNode';
import { CALLOUT_TRANSFORMER } from './CalloutTransformer';

export const calloutPlugin: ScriboPlugin = {
  name: 'callout',
  nodes: [CalloutNode],
  transformers: [CALLOUT_TRANSFORMER],
  editorPlugins: [CalloutPlugin],
  toolbarButtons: [
    {
      key: 'callout',
      label: 'Callout',
      iconClass: 'alert',
      onSelect: (editor) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchor = selection.anchor.getNode();
          const topLevel =
            $findMatchingParent(anchor, (n) => n.getParent()?.getType() === 'root') ?? anchor;

          const calloutNode = $createCalloutNode('NOTE');
          const p = $createParagraphNode();
          calloutNode.append(p);
          topLevel.insertAfter(calloutNode);
          p.selectEnd();
        });
      },
    },
  ],
};
