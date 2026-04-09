export type ScoringProfile = 'fibonacci' | 'tshirt' | 'letter_grades'

export const SCORING_PROFILE_OPTIONS: { value: ScoringProfile; label: string }[] = [
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'tshirt', label: 'T-Shirt' },
  { value: 'letter_grades', label: 'Letter Grades' },
]

const PROFILE_LABELS: Record<ScoringProfile, Record<string, string>> = {
  fibonacci:     { '1': '1', '2': '2', '3': '3', '5': '5', '8': '8', X: 'X' },
  tshirt:        { '1': 'XS', '2': 'S', '3': 'M', '5': 'L', '8': 'XL', X: 'X' },
  letter_grades: { '1': 'A', '2': 'B', '3': 'C', '5': 'D', '8': 'F', X: 'X' },
}

export function getProfileLabel(profile: ScoringProfile, value: string): string {
  return PROFILE_LABELS[profile]?.[value] ?? value
}

export const VOTE_VALUES = ['1', '2', '3', '5', '8', 'X'] as const
