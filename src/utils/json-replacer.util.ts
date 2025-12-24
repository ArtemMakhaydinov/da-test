export const jsonReplacer = (key: string, value: unknown): unknown => {
  if (key === 'password') return '*******';
  return typeof value === 'bigint' ? value.toString() : value;
};
