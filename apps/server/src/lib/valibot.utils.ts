import * as v from 'valibot';

export function sqliteBooleanField(defaultValue?: boolean) {
  const base = v.pipe(
    v.union([
      v.boolean(),
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(1)),
      v.literal('true'),
      v.literal('false'),
      v.literal('1'),
      v.literal('0'),
    ]),
    v.transform((value): 0 | 1 => {
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value === 'true' || value === '1') return 1;
      if (value === 'false' || value === '0') return 0;
      return value as 0 | 1;
    }),
  );

  return defaultValue !== undefined ? v.optional(base, defaultValue ? 1 : 0) : base;
}
