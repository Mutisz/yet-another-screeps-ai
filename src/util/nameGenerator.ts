import { random } from 'lodash';

export const generateCreepName = (prefix: string): string => {
  const number = String(random(1, 10000)).padStart(5, '0');

  return `${prefix}_${number}`;
};
