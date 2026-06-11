export const useHardware = () => {
  const hardwareInfo = ref({ os: 'Loading...', cpu: 'Loading...', gpu: null, memory: 0, hostname: 'Loading...', fingerprint: 'Loading...' })

  const fetchHardwareInfo = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/tauri')
      hardwareInfo.value = await invoke('get_hardware_info')
    } catch {}
  }

  onMounted(() => fetchHardwareInfo())

  return { hardwareInfo, fetchHardwareInfo }
}