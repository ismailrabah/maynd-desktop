// Maynd.ma Desktop - Hardware Detection Composable
import type { HardwareInfo, DeviceInfo } from '../types';

const hardwareInfo = ref<HardwareInfo | null>(null);
const hardwareFingerprint = ref<string>('');

export function useHardware() {
  const detectOS = (): string => {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Win')) return 'Windows';
      if (userAgent.includes('Mac')) return 'macOS';
      if (userAgent.includes('Linux')) return 'Linux';
    }
    return 'Unknown';
  };

  const detectArch = (): string => {
    return typeof navigator !== 'undefined' ? navigator.platform : 'Unknown';
  };

  const detectHostname = async (): Promise<string> => {
    return typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';
  };

  const detectCPU = async (): Promise<string> => {
    return typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown';
  };

  const detectMemory = async (): Promise<number> => {
    return typeof navigator !== 'undefined' && navigator.deviceMemory ? navigator.deviceMemory * 1024 : 8192;
  };

  const detectGPU = async (): Promise<string | undefined> => {
    if (typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch {}
    }
    return undefined;
  };

  const generateFingerprint = async (): Promise<string> => {
    const info = await getHardwareInfo();
    if (!info) return '';
    const fingerprintString = `${info.os}|${info.arch}|${info.hostname}|${info.cpu}|${info.memory}|${info.gpu || 'none'}`;
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const getHardwareInfo = async (): Promise<HardwareInfo | null> => {
    if (hardwareInfo.value) return hardwareInfo.value;
    try {
      const [os, arch, hostname, cpu, memory, gpu] = await Promise.all([
        Promise.resolve(detectOS()),
        Promise.resolve(detectArch()),
        detectHostname(),
        detectCPU(),
        detectMemory(),
        detectGPU()
      ]);
      hardwareInfo.value = { os, arch, hostname, cpu, memory, gpu };
      return hardwareInfo.value;
    } catch {
      return null;
    }
  };

  const getDeviceInfo = async (): Promise<DeviceInfo> => {
    const info = await getHardwareInfo();
    if (!info) return { os: 'Unknown', arch: 'Unknown', hostname: 'Unknown', cpu: 'Unknown', memory: 0 };
    return { ...info, ip_address: undefined };
  };

  const getHardwareFingerprint = async (): Promise<string> => {
    if (hardwareFingerprint.value) return hardwareFingerprint.value;
    const fingerprint = await generateFingerprint();
    hardwareFingerprint.value = fingerprint;
    return fingerprint;
  };

  onMounted(() => {
    getHardwareInfo();
    getHardwareFingerprint();
  });

  return {
    hardwareInfo,
    hardwareFingerprint,
    getHardwareInfo,
    getDeviceInfo,
    getHardwareFingerprint
  };
}
