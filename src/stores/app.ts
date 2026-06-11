import { defineStore } from 'pinia'
import type { AppSettings, ChatMessage, AIModel, Document } from '~/types'
export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    language: 'fr', theme: 'dark',
    ai: { model: 'qwen2.5-coder-7b', contextLength: 4096, threads: 4, temperature: 0.7, topP: 0.9, topK: 40, repeatPenalty: 1.1, gpuLayers: 0 },
    license: { key: '', hardwareBinding: true }
  })
  const chatMessages = ref<ChatMessage[]>([])
  const availableModels = ref<AIModel[]>([])
  const isAIReady = ref(false)
  const setLanguage = (lang) => { settings.value.language = lang }
  const addMessage = (msg) => { chatMessages.value.push(msg) }
  const setAIReady = (ready) => { isAIReady.value = ready }
  return { settings, chatMessages, availableModels, isAIReady, setLanguage, addMessage, setAIReady }
})