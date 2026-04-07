import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { User } from 'firebase/auth'

export interface Session {
  id: string
  name: string
  creator_uid: string
  memberIds: string[]
  integrations: string[]
  openIssues: number
  revealedIssues: number
  inviteToken?: string
  createdAt: { toMillis: () => number } | null
}

export function useSessions(user: User | null, authLoading = false) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    setLoading(true)

    const q = query(
      collection(db, 'sessions'),
      where('memberIds', 'array-contains', user.uid),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Session, 'id'>) }))
          .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
        setSessions(list)
        setLoading(false)
        setError(null)
      },
      () => {
        setError('Failed to load sessions. Please refresh.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user?.uid, authLoading])

  return { sessions, loading, error }
}
