import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createPDFBot } from '../services/botService.js'

const progressLabels = {
  uploading: 'Uploading',
  processing: 'Processing',
  creating: 'Creating Bot',
}

export default function CreatePDFBot() {
  const navigate = useNavigate()
  const [botName, setBotName] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [progressStep, setProgressStep] = useState('')
  const [uploadPercent, setUploadPercent] = useState(0)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isSubmitting = Boolean(progressStep)

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null
    setError('')

    const isPDF =
      selectedFile &&
      (selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf'))

    if (selectedFile && !isPDF) {
      setPdfFile(null)
      event.target.value = ''
      setError('Upload a PDF file.')
      return
    }

    setPdfFile(selectedFile)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedBotName = botName.trim()
    if (!trimmedBotName) {
      setError('Bot name is required.')
      return
    }

    if (!pdfFile) {
      setError('Upload a PDF file.')
      return
    }

    setError('')
    setSuccessMessage('')
    setUploadPercent(0)
    setProgressStep('uploading')

    try {
      await createPDFBot(trimmedBotName, pdfFile, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) {
            return
          }

          const nextPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          setUploadPercent(nextPercent)

          if (nextPercent >= 100) {
            setProgressStep('processing')
          }
        },
      })

      setProgressStep('creating')
      await new Promise((resolve) => {
        setTimeout(resolve, 300)
      })
      setSuccessMessage('PDF bot created successfully.')
      setTimeout(() => {
        navigate('/my-bots')
      }, 700)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setProgressStep('')
    }
  }

  return (
    <section className="max-w-xl rounded-lg border border-[#26354F] bg-[#1B2740] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <h2 className="text-2xl font-bold text-white">Create PDF Bot</h2>
      <p className="mt-2 text-[#94A3B8]">
        Upload a PDF and create a bot from its document content.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="pdf-bot-name"
            className="block text-sm font-medium text-slate-300"
          >
            Bot Name
          </label>
          <input
            id="pdf-bot-name"
            type="text"
            value={botName}
            onChange={(event) => setBotName(event.target.value)}
            placeholder="Research PDF Bot"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md border border-[#26354F] bg-[#1B2740] px-3 py-2 text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8]"
          />
        </div>

        <div>
          <label
            htmlFor="pdf-file"
            className="block text-sm font-medium text-slate-300"
          >
            PDF File
          </label>
          <input
            id="pdf-file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md border border-[#26354F] bg-[#1B2740] px-3 py-2 text-sm text-white transition file:mr-4 file:rounded-md file:border-0 file:bg-[#7C3AED] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#8B5CF6] disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8]"
          />
          {pdfFile && (
            <p className="mt-2 text-sm text-[#94A3B8]">{pdfFile.name}</p>
          )}
        </div>

        {progressStep && (
          <div className="rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2 text-sm text-[#F59E0B]">
            <p>{progressLabels[progressStep]}</p>
            {progressStep === 'uploading' && uploadPercent > 0 && (
              <p className="mt-1">{uploadPercent}% uploaded</p>
            )}
          </div>
        )}

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
          Create PDF Bot
        </button>
      </form>
    </section>
  )
}
