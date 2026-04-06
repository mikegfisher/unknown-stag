import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2 transition-colors hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
        <p className="text-gray-600">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
        </p>
      </div>
    </div>
  )
}
