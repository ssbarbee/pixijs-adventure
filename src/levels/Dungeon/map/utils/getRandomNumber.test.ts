import { getRandomNumber } from './getRandomNumber';

describe('getRandomNumber', () => {
  it('should return a number within the given range', () => {
    const min = 1;
    const max = 10;
    const number = getRandomNumber(min, max);
    expect(number).toBeGreaterThanOrEqual(min);
    expect(number).toBeLessThanOrEqual(max);
  });
});
