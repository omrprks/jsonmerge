import deepMerge from 'lodash.merge';

export const expand = (
  keys: string | string[],
  obj: Record<string, unknown> | unknown[],
  currentOutput: Record<string, unknown> | unknown[],
): Record<string, unknown> => {
  let result: Record<string, unknown> = {};
  const parts = typeof keys === 'string' ? keys.split('.') : keys;

  for (let i = parts.length; i > 0; i -= 1) {
    let current = parts[i - 1];
    let parent = parts[i - 2];

    const parentArray = parent?.match(/(\[[0-9]+\])$/);
    if (parentArray?.length) {
      const index = parseInt(parentArray[0].replace(/\[|\]/g, ''), 10);

      if (typeof index === 'number') {
        parent = parent.replace(/(\[[0-9]+\])$/, '');
        const arr = (result[parent] || []) as unknown[];

        arr[index] = { [current]: obj };

        result[parent] = arr;

        // eslint-disable-next-line no-continue
        continue;
      }
    }

    if (current?.match(/(\[[0-9]+\])$/)?.length) {
      current = current.replace(/(\[[0-9]+\])$/, '');
    }

    const next = {
      [current]: result[current] || obj,
    };

    result = parent ? { [parent]: next } : next;
  }

  return deepMerge(currentOutput, result);
};
