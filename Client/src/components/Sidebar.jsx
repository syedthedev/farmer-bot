import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

export default function Sidebar({ isOpen, onClose, onNewChat, sessions, activeSessionId, onSelect, onDelete }) {
  const [confirmingId, setConfirmingId] = useState(null)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-300
          transform transition-transform duration-200 ease-in-out
          flex flex-col shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-green-600">
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V6.75H9a.75.75 0 0 1 0-1.5h2.25V3a.75.75 0 0 1 .75-.75ZM12 15.75a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V18H9a.75.75 0 0 1 0-1.5h2.25V14.25a.75.75 0 0 1 .75-.75Z" />
              <path d="M6.75 6.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z" />
              <path d="M6.75 17.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
              <path d="M17.25 6.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z" />
              <path d="M17.25 17.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
            </svg>
            <h2 className="text-lg font-semibold text-green-600">FarmerBot</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-1">Weed Identification</p>
        </div>

        <div className="p-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full py-2.5 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H5.25a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 px-2">
            Sessions
          </div>
          <div className="space-y-1">
            {[...sessions].reverse().map((s) => {
              const isActive = s.id === activeSessionId
              return (
                <div
                  key={s.id}
                  className={`group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                    isActive
                      ? 'bg-green-50 border border-green-100'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                  onClick={() => onSelect(s.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                  </svg>
                  <span className={`flex-1 truncate ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {s.name}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmingId(s.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all shrink-0 cursor-pointer"
                    aria-label="Delete chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
      <ConfirmDialog
        isOpen={confirmingId !== null}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        onConfirm={() => { onDelete(confirmingId); setConfirmingId(null) }}
        onCancel={() => setConfirmingId(null)}
      />
    </>
  )
}
