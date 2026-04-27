export interface ParsedIssue {
  title: string
  externalUrl: string
}

export function parseIssueUrl(raw: string): ParsedIssue {
  const url = raw.trim()

  // GitHub: github.com/org/repo/issues/123
  const githubMatch = url.match(/github\.com\/([^/?#]+\/[^/?#]+)\/issues\/(\d+)/i)
  if (githubMatch) {
    return { title: `${githubMatch[1]} #${githubMatch[2]}`, externalUrl: url }
  }

  // Linear: linear.app/team/issue/KEY-456 or linear.app/team/issues/KEY-456
  const linearMatch = url.match(/linear\.app\/[^/?#]+\/issues?\/([A-Z]+-\d+)/i)
  if (linearMatch) {
    return { title: linearMatch[1].toUpperCase(), externalUrl: url }
  }

  // Jira/Atlassian: *.atlassian.net/browse/KEY-456
  const jiraMatch = url.match(/atlassian\.net\/browse\/([A-Z]+-\d+)/i)
  if (jiraMatch) {
    return { title: jiraMatch[1].toUpperCase(), externalUrl: url }
  }

  return { title: url, externalUrl: url }
}

export function parseIssueUrls(text: string): ParsedIssue[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(parseIssueUrl)
}
