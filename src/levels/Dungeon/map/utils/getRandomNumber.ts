// Utility functions
export function getRandomNumber(min: number, max: number): number {
  // Handle invalid ranges where min > max by swapping
  if (min > max) {
    [min, max] = [max, min];
  }
  // Handle case where min === max
  if (min === max) {
    return min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Safe random number generator that ensures min <= max.
 * If the computed range would be invalid, returns the fallback value.
 */
export function getSafeRandomNumber(min: number, max: number, fallback: number = 0): number {
  if (min > max) {
    return fallback;
  }
  if (min === max) {
    return min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
