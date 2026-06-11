export const useRAG = () => {
  const documents = ref([])
  const chunks = ref([])
  const processDocument = async (file) => {
    chunks.value.push({ id: Date.now(), content: await file.text(), metadata: { name: file.name } })
    documents.value.push({ id: Date.now(), name: file.name, size: file.size, processed: true })
    return chunks.value
  }
  const search = async (query, limit = 5) => { return [] }
  const getContext = async (query, limit = 5) => { return '' }
  const deleteDocument = async (id) => { documents.value = documents.value.filter(d => d.id !== id); return true }
  const clearAll = async () => { documents.value = []; chunks.value = []; return true }
  return { documents, chunks, processDocument, search, getContext, deleteDocument, clearAll }
}