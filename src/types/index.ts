export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}
export interface AIModel {
  id: string
  name: string
  file: string
  size: number
  type: 'coder' | 'general' | 'unknown'
  description: string
}
export interface HardwareInfo {
  os: string
  cpu: string
  gpu: string | null
  memory: number
  hostname: string
  fingerprint: string
}