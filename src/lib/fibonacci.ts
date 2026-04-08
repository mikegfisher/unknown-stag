export const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]

export function roundUpToFibonacci(n: number): number {
  for (const f of FIBONACCI) {
    if (f >= n) return f
  }
  return FIBONACCI[FIBONACCI.length - 1]
}
