import type { AIModel } from "~/types"
export const useAI = () => {
  const models = ref<AIModel[]>([])
  const loadedModel = ref<AIModel | null>(null)
  const availableModels: AIModel[] = [
    { id: 'qwen2.5-coder-7b', name: 'Qwen 2.5 Coder 7B', file: 'qwen2.5-coder-7b-q4_k_m.gguf', size: 4.7, type: 'coder', description: 'Code generation' },
    { id: 'llama-3.2-1b', name: 'Llama 3.2 1B', file: 'llama-3.2-1b-q4_k_m.gguf', size: 0.6, type: 'general', description: 'Lightweight' },
    { id: 'mistral-7b', name: 'Mistral 7B', file: 'mistral-7b-q4_k_m.gguf', size: 4.1, type: 'general', description: 'Balanced' }
  ]
  const scanModels = async () => {
    try {
      const { readDir } = await import('@tauri-apps/api/fs')
      const entries = await readDir('./models')
      models.value = entries.map(e => availableModels.find(m => m.file === e.name) || { id: e.name, name: e.name, file: e.name, size: 0, type: 'unknown', description: 'Unknown' })
    } catch {}
  }
  const loadModel = async (model: AIModel) => {
    try {
      loadedModel.value = model
      return true
    } catch { return false }
  }
  onMounted(() => scanModels())
  return { models, availableModels, loadedModel, scanModels, loadModel }
}