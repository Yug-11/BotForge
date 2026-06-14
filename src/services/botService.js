import api, { getApiErrorMessage } from './api.js'

export async function getBots() {
  try {
    const response = await api.get('/bots')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch bots.'), {
      cause: error,
    })
  }
}

export async function createTopicBot(botName) {
  try {
    const response = await api.post('/create-topic-bot', {
      bot_name: botName,
    })

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create topic bot.'), {
      cause: error,
    })
  }
}

export async function createPDFBot(botName, pdfFile, options = {}) {
  const formData = new FormData()
  formData.append('bot_name', botName)
  formData.append('pdf_file', pdfFile)

  try {
    const response = await api.post('/create-pdf-bot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onUploadProgress,
    })

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create PDF bot.'), {
      cause: error,
    })
  }
}
