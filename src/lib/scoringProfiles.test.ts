import { describe, it, expect } from 'vitest'
import { getProfileLabel } from './scoringProfiles'

describe('getProfileLabel', () => {
  it('returns numeric labels for fibonacci profile', () => {
    expect(getProfileLabel('fibonacci', '1')).toBe('1')
    expect(getProfileLabel('fibonacci', '2')).toBe('2')
    expect(getProfileLabel('fibonacci', '3')).toBe('3')
    expect(getProfileLabel('fibonacci', '5')).toBe('5')
    expect(getProfileLabel('fibonacci', '8')).toBe('8')
    expect(getProfileLabel('fibonacci', 'X')).toBe('X')
  })

  it('returns t-shirt size labels for tshirt profile', () => {
    expect(getProfileLabel('tshirt', '1')).toBe('XS')
    expect(getProfileLabel('tshirt', '2')).toBe('S')
    expect(getProfileLabel('tshirt', '3')).toBe('M')
    expect(getProfileLabel('tshirt', '5')).toBe('L')
    expect(getProfileLabel('tshirt', '8')).toBe('XL')
    expect(getProfileLabel('tshirt', 'X')).toBe('X')
  })

  it('returns letter grade labels for letter_grades profile', () => {
    expect(getProfileLabel('letter_grades', '1')).toBe('A')
    expect(getProfileLabel('letter_grades', '2')).toBe('B')
    expect(getProfileLabel('letter_grades', '3')).toBe('C')
    expect(getProfileLabel('letter_grades', '5')).toBe('D')
    expect(getProfileLabel('letter_grades', '8')).toBe('F')
    expect(getProfileLabel('letter_grades', 'X')).toBe('X')
  })

  it('falls back to the raw value for unknown values', () => {
    expect(getProfileLabel('fibonacci', '4')).toBe('4')
    expect(getProfileLabel('tshirt', '13')).toBe('13')
  })
})
