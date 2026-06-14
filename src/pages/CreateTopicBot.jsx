import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createTopicBot } from '../services/botService.js'

export default function CreateTopicBot() {
  const navigate = useNavigate()
  const [botName, setBotName] = useState('')
  const [pdfFiles, setPdfFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  function handlePdfFileChange(event) {
    const selectedFiles = Array.from(event.target.files || [])
    setError('')

    const invalidFile = selectedFiles.find(
      (file) =>
        file.type !== 'application/pdf' &&
        !file.name.toLowerCase().endsWith('.pdf'),
    )

    if (invalidFile) {
      setPdfFiles([])
      event.target.value = ''
      setError('Upload PDF files only.')
      return
    }

    setPdfFiles(selectedFiles)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedBotName = botName.trim()
    if (!trimmedBotName) {
      setError('Bot name is required.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      if (pdfFiles.length > 0) {
        await createTopicBot(trimmedBotName, trimmedBotName, pdfFiles)
      } else {
        await createTopicBot(trimmedBotName)
      }

      setSuccessMessage('Bot created successfully.')
      setTimeout(() => {
        navigate('/my-bots')
      }, 700)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-xl rounded-lg border border-[#26354F] bg-[#1B2740] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <h2 className="text-2xl font-bold text-white">Create Hybrid Knowledge Bot</h2>
      <p className="mt-2 text-[#94A3B8]">
        Create a topic bot with optional PDF knowledge.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="bot-name"
            className="block text-sm font-medium text-slate-300"
          >
            Bot Name
          </label>
          <input
            id="bot-name"
            type="text"
            value={botName}
            onChange={(event) => setBotName(event.target.value)}
            placeholder="IPL Bot"
            className="mt-2 w-full rounded-md border border-[#26354F] bg-[#1B2740] px-3 py-2 text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="pdf-files"
            className="block text-sm font-medium text-slate-300"
          >
            Upload PDFs (Optional)
          </label>
          <input
            id="pdf-files"
            type="file"
            accept="application/pdf,.pdf"
            multiple
            onChange={handlePdfFileChange}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md border border-[#26354F] bg-[#1B2740] px-3 py-2 text-sm text-white transition file:mr-4 file:rounded-md file:border-0 file:bg-[#7C3AED] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#8B5CF6] disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8]"
          />
        </div>

        {pdfFiles.length > 0 && (
          <div className="rounded-md border border-[#26354F] bg-[#071126]/40 px-3 py-2">
            <p className="text-sm font-medium text-white">Selected PDFs</p>
            <ul className="mt-2 space-y-1 text-sm text-[#94A3B8]">
              {pdfFiles.map((file) => (
                <li key={`${file.name}-${file.size}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <p className="rounded-md border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-2 text-sm font-medium text-[#10B981]">
            Web Research Enabled
          </p>
          <p
            className={[
              'rounded-md border px-3 py-2 text-sm font-medium',
              pdfFiles.length > 0
                ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
                : 'border-[#26354F] bg-[#071126]/40 text-[#94A3B8]',
            ].join(' ')}
          >
            {pdfFiles.length > 0
              ? 'PDF Knowledge Enabled'
              : 'PDF Knowledge Disabled'}
          </p>
        </div>

        <p className="text-sm text-[#94A3B8]">
          {pdfFiles.length > 0
            ? 'This bot will be created as a Hybrid Knowledge Bot.'
            : 'No PDFs uploaded. This bot will work as a Topic Bot.'}
        </p>

        {error && (
          <p className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-2 text-sm text-[#10B981]">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white shadow-[0_0_22px_rgba(124,58,237,0.28)] transition hover:bg-[#8B5CF6] hover:shadow-[0_0_28px_rgba(124,58,237,0.42)] disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8] disabled:shadow-none"
        >
          {isSubmitting ? 'Creating...' : 'Create Bot'}
        </button>
      </form>
    </section>
  )
}
