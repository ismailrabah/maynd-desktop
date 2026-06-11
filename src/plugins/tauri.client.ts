import { invoke } from '@tauri-apps/api/tauri'
export default defineNuxtPlugin(() => ({
  provide: {
    tauri: { invoke }
  }
}))