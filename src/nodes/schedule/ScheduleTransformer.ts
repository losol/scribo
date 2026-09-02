import type { ElementTransformer } from '@lexical/markdown';

import {
  $createScheduleItemNode,
  $isScheduleItemNode,
  type ScheduleItemData,
  ScheduleItemNode,
} from './ScheduleItemNode';

/**
 * Markdown format: `- **09:00–10:00** Title | Speaker | Description`
 *
 * This matches the format expected by the remarkSchedule plugin in
 * markdown-plugin-happening, so the same markdown renders correctly
 * both in the editor and on the frontend.
 */
const SCHEDULE_ITEM_REGEX =
  /^-\s+\*\*(\d{1,2}[.:]\d{2}(?:\s*[–-]\s*\d{1,2}[.:]\d{2})?)\s*\*\*\s+(.+)$/;

export function normalizeScheduleItemData(data: Partial<ScheduleItemData>): ScheduleItemData {
  return {
    time: (data.time ?? '').trim(),
    title: data.title ?? '',
    speaker: data.speaker?.trim() || undefined,
    description: data.description?.trim() || undefined,
  };
}

export function parseScheduleItemMarkdown(markdown: string): ScheduleItemData | null {
  const match = markdown.match(SCHEDULE_ITEM_REGEX);
  if (!match) return null;

  const time = (match[1] ?? '').replaceAll('.', ':');
  const rest = match[2] ?? '';
  const parts = rest.split('|').map((s) => s.trim());

  return normalizeScheduleItemData({
    time,
    title: parts[0] ?? '',
    speaker: parts[1] || undefined,
    description: parts[2] || undefined,
  });
}

export function formatScheduleItemMarkdown(data: ScheduleItemData): string {
  const normalized = normalizeScheduleItemData(data);
  const parts = [normalized.title, normalized.speaker, normalized.description].filter(Boolean);
  return `- **${normalized.time}** ${parts.join(' | ')}`;
}

export const SCHEDULE_ITEM_TRANSFORMER: ElementTransformer = {
  type: 'element',
  dependencies: [ScheduleItemNode],

  regExp: SCHEDULE_ITEM_REGEX,

  export: (node) => {
    if (!$isScheduleItemNode(node)) return null;

    return formatScheduleItemMarkdown(node.getData());
  },

  replace: (parentNode, _children, match) => {
    const node = $createScheduleItemNode(
      parseScheduleItemMarkdown(match[0] ?? '') ?? { time: '', title: '' }
    );

    parentNode.replace(node);
  },
};
