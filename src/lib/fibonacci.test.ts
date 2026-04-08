import { describe, it, expect } from 'vitest'
import { roundUpToFibonacci } from './fibonacci'

describe('roundUpToFibonacci', () => {
  it('returns exact Fibonacci numbers unchanged', () => {
    expect(roundUpToFibonacci(1)).toBe(1)
    expect(roundUpToFibonacci(2)).toBe(2)
    expect(roundUpToFibonacci(3)).toBe(3)
    expect(roundUpToFibonacci(5)).toBe(5)
    expect(roundUpToFibonacci(8)).toBe(8)
    expect(roundUpToFibonacci(13)).toBe(13)
    expect(roundUpToFibonacci(21)).toBe(21)
  })

  it('rounds up to the nearest Fibonacci number for the examples in issue #139', () => {
    expect(roundUpToFibonacci(1.0)).toBe(1)
    expect(roundUpToFibonacci(1.1)).toBe(2)
    expect(roundUpToFibonacci(1.5)).toBe(2)
    expect(roundUpToFibonacci(2.0)).toBe(2)
    expect(roundUpToFibonacci(2.1)).toBe(3)
    expect(roundUpToFibonacci(3.5)).toBe(5)
    expect(roundUpToFibonacci(4.0)).toBe(5)
    expect(roundUpToFibonacci(6.0)).toBe(8)
  })

  it('caps at 21 for averages above 21', () => {
    expect(roundUpToFibonacci(21.1)).toBe(21)
    expect(roundUpToFibonacci(22)).toBe(21)
    expect(roundUpToFibonacci(100)).toBe(21)
  })
})
