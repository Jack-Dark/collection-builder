export const pluralize = (
  word: string,
  length: number,
  pluralSpelling?: string,
) => {
  return length === 1 ? word : pluralSpelling || `${word}s`;
};
