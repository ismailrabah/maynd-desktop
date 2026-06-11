export const useDatabase = () => {
  const dbPath = ref('./maynd-db.sqlite')
  const isConnected = ref(false)
  const initDatabase = async () => { isConnected.value = true; return true }
  const storeChunks = async (chunks) => { console.log('Storing', chunks.length, 'chunks'); return true }
  const searchSimilar = async (queryEmbedding, limit = 5) => { return [] }
  onMounted(() => initDatabase())
  return { dbPath, isConnected, storeChunks, searchSimilar }
}