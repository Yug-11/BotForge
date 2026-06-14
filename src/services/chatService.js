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
