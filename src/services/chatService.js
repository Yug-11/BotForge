import api, { getApiErrorMessage } from './api.js'

export async function chat(collectionName, question) {
  try {
    const response = await api.post('/chat', {
      collection_name: collectionName,
      question,
    })

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to send chat message.'), {
      cause: error,
    })
  }
}

export async function getChatHistory(botId) {
  try {
    const response = await api.get(`/chat-history/${encodeURIComponent(botId)}`)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load chat history.'), {
      cause: error,
    })
  }
}

export async function clearChatHistory(botId) {
  try {
    const response = await api.delete(
      `/chat-history/${encodeURIComponent(botId)}`,
    )
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to clear chat history.'), {
      cause: error,
    })
  }
}
