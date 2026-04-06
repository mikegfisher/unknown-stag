import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
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
  createdAt: { toMillis: () => number } | null
}

export function useSessions(user: User | null) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'sessions'),
      where('memberIds', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Session, 'id'>),
      }))
      setSessions(list)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  return { sessions, loading }
}
