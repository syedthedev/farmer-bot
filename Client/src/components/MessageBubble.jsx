import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MessageBubble({ role, content }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-green-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-300 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500 shrink-0">
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V6.75H9a.75.75 0 0 1 0-1.5h2.25V3a.75.75 0 0 1 .75-.75ZM12 15.75a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0V18H9a.75.75 0 0 1 0-1.5h2.25V14.25a.75.75 0 0 1 .75-.75Z" />
          </svg>
          <span className="text-xs font-semibold text-green-700">FarmerBot</span>
        </div>
        <div className="prose prose-sm prose-gray max-w-none leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      </div>
    </div>
  )
}
