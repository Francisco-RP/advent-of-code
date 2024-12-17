/**
 * Greated Common Denominator
 * source: https://en.wikipedia.org/wiki/Euclidean_algorithm
 */
export function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

/**
 * Lowest common multiple
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}
