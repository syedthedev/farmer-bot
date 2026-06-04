export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-400 mx-auto mb-4">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V6.75H9a.75.75 0 0 1 0-1.5h2.25V3a.75.75 0 0 1 .75-.75ZM12 15.75a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V18H9a.75.75 0 0 1 0-1.5h2.25V14.25a.75.75 0 0 1 .75-.75Z" />
          <path d="M6.75 6.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z" />
          <path d="M6.75 17.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
          <path d="M17.25 6.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Z" />
          <path d="M17.25 17.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Ask about a weed you've spotted in your fields
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Describe the plant's leaves, flowers, height, and growing conditions for identification.
        </p>
      </div>
    </div>
  )
}
