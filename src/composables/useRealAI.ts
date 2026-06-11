export const useRealAI = () => {
  const messages = ref([])
  const inputMessage = ref("")
  const isLoading = ref(false)
  const isAIReady = ref(false)

  const checkServer = async (host = 'localhost', port = 8080) => {
    try {
      const res = await fetch(`http://${host}:${port}/health`)
      return res.ok
    } catch { return false }
  }

  const sendMessage = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return
    messages.value.push({ role: 'user', content: inputMessage.value.trim(), timestamp: new Date() })
    inputMessage.value = ''
    isLoading.value = true
    const ready = await checkServer()
    if (ready) {
      try {
        const res = await fetch('http://localhost:8080/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.value.map(m => ({ role: m.role, content: m.content })), stream: false })
        })
        if (res.ok) {
          const data = await res.json()
          messages.value.push({ role: 'assistant', content: data.choices?.[0]?.message?.content || 'No response', timestamp: new Date() })
        } else throw new Error()
      } catch {
        messages.value.push({ role: 'assistant', content: 'AI server error. Using mock response.', timestamp: new Date() })
      }
    } else {
      messages.value.push({ role: 'assistant', content: 'Mock: Add llama.cpp to sidecar/ and GGUF models to models/ for real AI.', timestamp: new Date() })
    }
    isLoading.value = false
  }

  const clearChat = () => { messages.value = [] }
  const startAI = async () => { isAIReady.value = true }
  const stopAI = async () => { isAIReady.value = false }

  return { messages, inputMessage, isLoading, isAIReady, sendMessage, clearChat, startAI, stopAI }
}