/* eslint-disable @typescript-eslint/no-explicit-any */
export const numerifyBigint = (value: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(value).map(([key, value]): [string, Exclude<any, bigint>] => {
      if (typeof value === 'bigint') {
        return [key, Number(value)];
      }

      if (typeof value === 'object') {
        if (value === null) {
          return [key, null];
        }
        if (Object.keys(value).length === 0) {
          return [key, value];
        }

        return [key, numerifyBigint(value as Record<string, unknown>)];
      }

      return [key, value];
    }),
  );
};
