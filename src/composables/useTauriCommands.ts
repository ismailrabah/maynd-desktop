export const useTauriCommands = () => {
  const getHardwareInfo = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/tauri')
      return await invoke('get_hardware_info')
    } catch { return {} }
  }

  const startAIEngine = async (config) => {
    try {
      const { invoke } = await import('@tauri-apps/api/tauri')
      return await invoke('start_ai_engine', { config })
    } catch { return false }
  }

  const stopAIEngine = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/tauri')
      return await invoke('stop_ai_engine')
    } catch { return false }
  }

  const readFile = async (path) => {
    try {
      const { readTextFile } = await import('@tauri-apps/api/fs')
      return await readTextFile(path)
    } catch { return '' }
  }

  return { getHardwareInfo, startAIEngine, stopAIEngine, readFile }
}