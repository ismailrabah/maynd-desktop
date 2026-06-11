<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex flex-col h-[calc(100vh-180px)] border border-gray-700 rounded-lg overflow-hidden">
      <div class="p-4 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
        <h2 class="font-semibold">Chat</h2>
        <UButton variant="ghost" size="sm" @click="clearChat">Clear</UButton>
      </div>
      <div ref="messagesContainer" class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-950">
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <p>No messages. Start a conversation!</p>
        </div>
        <div v-else v-for="(msg, i) in messages" :key="i" class="flex gap-3" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[80%] p-4 rounded-lg" :class="msg.role === 'user' ? 'bg-green-500 text-white' : 'bg-gray-800'">
            {{ msg.content }}
          </div>
        </div>
        <div v-if="isLoading" class="p-4 bg-gray-800 rounded-lg">Thinking...</div>
      </div>
      <div class="p-4 border-t border-gray-700 bg-gray-900 flex gap-2">
        <UInput v-model="inputMessage" placeholder="Type your message..." class="flex-1" @keydown.enter="sendMessage" />
        <UButton @click="sendMessage">Send</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const messages = ref([])
const inputMessage = ref("")
const isLoading = ref(false)
const messagesContainer = ref(null)

const sendMessage = () => {
  if (!inputMessage.value.trim()) return
  messages.value.push({ role: 'user', content: inputMessage.value })
  inputMessage.value = ''
  isLoading.value = true
  setTimeout(() => {
    messages.value.push({ role: 'assistant', content: 'This is a mock response. Add llama.cpp to sidecar/ and models to models/ for real AI.' })
    isLoading.value = false
  }, 1000)
}

const clearChat = () => { messages.value = [] }
</script>