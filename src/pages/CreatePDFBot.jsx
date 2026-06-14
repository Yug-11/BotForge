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
    <section className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Create PDF Bot</h2>
      <p className="mt-2 text-slate-600">
        Upload a PDF and create a bot from its document content.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="pdf-bot-name"
            className="block text-sm font-medium text-slate-700"
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
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="pdf-file"
            className="block text-sm font-medium text-slate-700"
          >
            PDF File
          </label>
          <input
            id="pdf-file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          {pdfFile && (
            <p className="mt-2 text-sm text-slate-600">{pdfFile.name}</p>
          )}
        </div>

        {progressStep && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            <p>{progressLabels[progressStep]}</p>
            {progressStep === 'uploading' && uploadPercent > 0 && (
              <p className="mt-1">{uploadPercent}% uploaded</p>
            )}
          </div>
        )}

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Create PDF Bot
        </button>
      </form>
    </section>
  )
}
