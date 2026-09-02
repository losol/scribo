import { describe, expect, it } from 'vitest';

import { formatScheduleItemMarkdown, SCHEDULE_ITEM_TRANSFORMER } from './ScheduleTransformer';

describe('ScheduleTransformer', () => {
  it('accepts trailing whitespace before the closing bold marker', () => {
    const match = SCHEDULE_ITEM_TRANSFORMER.regExp?.exec(
      '- **17:30-18:15 ** A really cool lecture | Leo Losen'
    );

    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('17:30-18:15');
    expect(match?.[2]).toBe('A really cool lecture | Leo Losen');
  });

  it('trims time values before exporting markdown', () => {
    expect(
      formatScheduleItemMarkdown({
        time: '17:30-18:15 ',
        title: 'A really cool lecture',
        speaker: 'Leo Losen',
      })
    ).toBe('- **17:30-18:15** A really cool lecture | Leo Losen');
  });
});
