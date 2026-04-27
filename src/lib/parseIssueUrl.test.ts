import { describe, it, expect } from 'vitest'
import { parseIssueUrl, parseIssueUrls } from './parseIssueUrl'

describe('parseIssueUrl', () => {
  it('parses GitHub issue URLs with https', () => {
    expect(parseIssueUrl('https://github.com/org/repo/issues/123')).toEqual({
      title: 'org/repo #123',
      externalUrl: 'https://github.com/org/repo/issues/123',
    })
  })

  it('parses GitHub issue URLs without protocol', () => {
    expect(parseIssueUrl('github.com/org/repo/issues/42')).toEqual({
      title: 'org/repo #42',
      externalUrl: 'github.com/org/repo/issues/42',
    })
  })

  it('parses Linear issue URLs (singular /issue/)', () => {
    expect(parseIssueUrl('https://linear.app/myteam/issue/KEY-456')).toEqual({
      title: 'KEY-456',
      externalUrl: 'https://linear.app/myteam/issue/KEY-456',
    })
  })

  it('parses Linear issue URLs (plural /issues/)', () => {
    expect(parseIssueUrl('https://linear.app/myteam/issues/ENG-789')).toEqual({
      title: 'ENG-789',
      externalUrl: 'https://linear.app/myteam/issues/ENG-789',
    })
  })

  it('parses Jira/Atlassian issue URLs', () => {
    expect(parseIssueUrl('https://mycompany.atlassian.net/browse/PROJ-456')).toEqual({
      title: 'PROJ-456',
      externalUrl: 'https://mycompany.atlassian.net/browse/PROJ-456',
    })
  })

  it('uppercases Linear issue key', () => {
    const result = parseIssueUrl('https://linear.app/team/issue/eng-10')
    expect(result.title).toBe('ENG-10')
  })

  it('uppercases Jira issue key', () => {
    const result = parseIssueUrl('https://corp.atlassian.net/browse/bug-1')
    expect(result.title).toBe('BUG-1')
  })

  it('falls back to full URL as title for unrecognized URLs', () => {
    const url = 'https://example.com/some-issue'
    expect(parseIssueUrl(url)).toEqual({ title: url, externalUrl: url })
  })

  it('always stores the original URL as externalUrl', () => {
    const url = 'https://github.com/org/repo/issues/1'
    expect(parseIssueUrl(url).externalUrl).toBe(url)
  })
})

describe('parseIssueUrls', () => {
  it('parses multiple URLs from multiline text', () => {
    const text = [
      'https://github.com/org/repo/issues/1',
      'https://linear.app/team/issue/ENG-2',
      'https://corp.atlassian.net/browse/PROJ-3',
    ].join('\n')
    expect(parseIssueUrls(text)).toEqual([
      { title: 'org/repo #1', externalUrl: 'https://github.com/org/repo/issues/1' },
      { title: 'ENG-2', externalUrl: 'https://linear.app/team/issue/ENG-2' },
      { title: 'PROJ-3', externalUrl: 'https://corp.atlassian.net/browse/PROJ-3' },
    ])
  })

  it('ignores empty lines', () => {
    const text = 'https://github.com/org/repo/issues/1\n\n   \nhttps://github.com/org/repo/issues/2'
    expect(parseIssueUrls(text)).toHaveLength(2)
  })

  it('ignores whitespace-only lines', () => {
    const text = '  \n\t\n  '
    expect(parseIssueUrls(text)).toHaveLength(0)
  })

  it('returns empty array for empty input', () => {
    expect(parseIssueUrls('')).toEqual([])
  })

  it('preserves order of URLs', () => {
    const text = 'https://github.com/a/b/issues/1\nhttps://github.com/c/d/issues/2'
    const result = parseIssueUrls(text)
    expect(result[0].title).toBe('a/b #1')
    expect(result[1].title).toBe('c/d #2')
  })
})
