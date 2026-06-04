import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import InputBar from './components/InputBar'

const API_BASE = import.meta.env.VITE_BACKEND;

function createSession() {
  return {
    id: crypto.randomUUID(),
    name: 'New Chat',
    messages: [],
  }
}

export default function App() {
  const [sessions, setSessions] = useState(() => [createSession()])
  const [activeId, setActiveId] = useState(sessions[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0]

  const updateActiveSession = useCallback((updater) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeId ? updater(s) : s))
    )
  }, [activeId])

  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return

    const isFirst = activeSession.messages.length === 0

    updateActiveSession((s) => ({
      ...s,
      name: isFirst ? text.slice(0, 35) + (text.length > 35 ? '...' : '') : s.name,
      messages: [...s.messages, { role: 'user', content: text }],
    }))

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, session_id: activeId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      updateActiveSession((s) => ({
        ...s,
        messages: [...s.messages, { role: 'assistant', content: data.response }],
      }))
    } catch {
      updateActiveSession((s) => ({
        ...s,
        messages: [
          ...s.messages,
          { role: 'assistant', content: 'Error connecting to server. Make sure the backend is running on port 8000.' },
        ],
      }))
    } finally {
      setIsLoading(false)
    }
  }, [activeId, activeSession.messages.length, updateActiveSession])

  const handleNewChat = () => {
    const newSession = createSession()
    setSessions((prev) => [...prev, newSession])
    setActiveId(newSession.id)
  }

  const handleSelectSession = (id) => {
    setActiveId(id)
    setSidebarOpen(false)
  }

  const handleDeleteSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (next.length === 0) {
        const fresh = createSession()
        return [fresh]
      }
      return next
    })
    setActiveId((current) => {
      if (current === id) {
        const remaining = sessions.filter((s) => s.id !== id)
        return remaining.length > 0 ? remaining[0].id : crypto.randomUUID()
      }
      return current
    })
    fetch(`${API_BASE}/session/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  return (
    <div className="h-dvh w-screen overflow-hidden bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        sessions={sessions}
        activeSessionId={activeId}
        onSelect={handleSelectSession}
        onDelete={handleDeleteSession}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-300 bg-white flex items-center px-4 shrink-0 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-green-600 transition-colors"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="ml-3 font-semibold text-gray-900 text-lg">FarmerBot</h1>
        </header>
        <ChatView messages={activeSession.messages} isLoading={isLoading} />
        <InputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
