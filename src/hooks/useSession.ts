import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Session } from './useSessions'

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      setSession(null)
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, 'sessions', sessionId),
      (snapshot) => {
        if (snapshot.exists()) {
          setSession({ id: snapshot.id, ...(snapshot.data() as Omit<Session, 'id'>) })
        } else {
          setSession(null)
        }
        setLoading(false)
      },
    )

    return unsubscribe
  }, [sessionId])

  return { session, loading }
}
