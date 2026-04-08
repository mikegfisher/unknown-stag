import { useState } from 'react'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export const READINESS_SCALE = [
  {
    value: 1,
    label: 'Fully defined',
    description: 'Clear acceptance criteria, right-sized, no open questions. Ready for Claude to implement immediately.',
  },
  {
    value: 2,
    label: 'Mostly clear',
    description: "Minor ambiguity that probably won't block implementation. Roughly right-sized.",
  },
  {
    value: 3,
    label: 'Some gaps',
    description: 'Needs a small discussion or some breakdown before handing off.',
  },
  {
    value: 5,
    label: 'Significant ambiguity',
    description: 'Needs breakdown into smaller, right-sized pieces or more definition.',
  },
  {
    value: 8,
    label: 'Not ready',
    description: 'Major open questions, dependencies, or scope issues. Not right-sized.',
  },
]

export function getReadinessLabel(value: number): string | undefined {
  return READINESS_SCALE.find((r) => r.value === value)?.label
}

export function ReadinessGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Readiness guide"
        aria-label="Open readiness guide"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)'
        }}
      >
        <BookOpenIcon style={{ width: '1.125rem', height: '1.125rem' }} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Readiness guide"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Readiness scale
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '1rem',
                  lineHeight: 1,
                  borderRadius: '0.25rem',
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Vote on how ready each issue is for AI-assisted implementation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {READINESS_SCALE.map(({ value, label, description }) => (
                <div key={value} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {value}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
