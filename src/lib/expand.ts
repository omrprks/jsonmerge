export const expand = (
  keys: string | string[],
  obj: Record<string, unknown> = {},
): Record<string, unknown> => {
  let result: Record<string, unknown> = {};
  const parts = typeof keys === 'string' ? keys.split('.') : keys;

  for (let i = parts.length; i > 0; i -= 1) {
    const current = parts[i - 1];
    const parent = parts[i - 2];

    const next = {
      [current]: result[current] || obj,
    };

    result = parent ? { [parent]: next } : next;
  }

  return result;
};

export default expand;
