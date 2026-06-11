// Maynd.ma Desktop - License Validation Composable
import type { LicenseValidationResult } from '../types';

const licenseCache = useState<LicenseValidationResult | null>('license-cache', () => null);
const lastValidationTime = useState<number>('last-validation-time', () => 0);
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function useLicense() {
  const config = useRuntimeConfig();
  const adminApiUrl = computed(() => config.public.adminApiUrl || 'http://localhost:4000/api');
  const isValidating = ref(false);
  const validationError = ref<string | null>(null);
  const isOnline = ref(true);

  const validateLicense = async (licenseKey?: string): Promise<LicenseValidationResult> => {
    const key = licenseKey || localStorage.getItem('maynd-license-key') || '';
    if (!key) return { valid: false, error: 'No license key provided' };
    
    if (licenseCache.value && Date.now() - lastValidationTime.value < CACHE_DURATION) {
      return licenseCache.value;
    }
    
    isValidating.value = true;
    validationError.value = null;
    
    try {
      const { getHardwareFingerprint, getDeviceInfo } = useHardware();
      const fingerprint = await getHardwareFingerprint();
      const deviceInfo = await getDeviceInfo();
      
      const response = await $fetch(`${adminApiUrl.value}/licenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { license_key: key, hardware_fingerprint: fingerprint, device_info: deviceInfo }
      });
      
      if (response.success && response.valid) {
        licenseCache.value = { valid: true, license: response.license, device: response.device };
        lastValidationTime.value = Date.now();
        isOnline.value = true;
        localStorage.setItem('maynd-license-key', key);
        return licenseCache.value;
      } else {
        licenseCache.value = { valid: false, error: response.error || 'Invalid license' };
        lastValidationTime.value = Date.now();
        isOnline.value = true;
        return licenseCache.value;
      }
    } catch (error) {
      isOnline.value = false;
      validationError.value = 'Failed to connect to license server';
      if (licenseCache.value) return { ...licenseCache.value, error: 'Offline - using cached validation' };
      return { valid: false, error: 'License server unavailable' };
    } finally {
      isValidating.value = false;
    }
  };

  const quickValidate = async (licenseKey?: string): Promise<LicenseValidationResult> => {
    const key = licenseKey || localStorage.getItem('maynd-license-key') || '';
    if (!key) return { valid: false, error: 'No license key provided' };
    try {
      const response = await $fetch(`${adminApiUrl.value}/licenses/validate/${key}`);
      if (response.success && response.valid) return { valid: true, license: response.license };
      return { valid: false, error: response.error || 'Invalid license' };
    } catch (error) {
      return { valid: false, error: 'Validation failed' };
    }
  };

  const registerDevice = async (licenseKey: string): Promise<boolean> => {
    try {
      const { getHardwareFingerprint, getDeviceInfo } = useHardware();
      const fingerprint = await getHardwareFingerprint();
      const deviceInfo = await getDeviceInfo();
      const response = await $fetch(`${adminApiUrl.value}/devices/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { license_key: licenseKey, hardware_fingerprint: fingerprint, ...deviceInfo }
      });
      return response.success;
    } catch (error) {
      return false;
    }
  };

  const saveLicenseKey = (key: string) => {
    localStorage.setItem('maynd-license-key', key);
    licenseCache.value = null;
  };

  const removeLicenseKey = () => {
    localStorage.removeItem('maynd-license-key');
    licenseCache.value = null;
    lastValidationTime.value = 0;
  };

  const isLicenseValid = computed(() => {
    if (!licenseCache.value) return false;
    if (Date.now() - lastValidationTime.value > CACHE_DURATION) return false;
    return licenseCache.value.valid;
  });

  return {
    adminApiUrl,
    isValidating,
    validationError,
    isOnline,
    validateLicense,
    quickValidate,
    registerDevice,
    saveLicenseKey,
    removeLicenseKey,
    isLicenseValid
  };
}
