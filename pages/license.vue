<template>
  <div class="max-w-3xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-8">License</h1>
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">License Status</h2>
      <UCard variant="ghost">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="valid ? 'bg-green-500/20' : 'bg-red-500/20'">
            <UIcon :name="valid ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="text-3xl" :class="valid ? 'text-green-500' : 'text-red-500'" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">{{ valid ? 'Valid' : 'Invalid' }}</h3>
            <p class="text-gray-400">{{ valid ? 'Your license is active.' : 'Please enter a valid license key.' }}</p>
          </div>
        </div>
      </UCard>
    </section>
    <section>
      <h2 class="text-lg font-semibold mb-4">Activate License</h2>
      <UCard variant="ghost">
        <UFormGroup label="License Key" class="mb-4">
          <UInput v-model="licenseKey" placeholder="Enter your license key" />
        </UFormGroup>
        <UButton @click="activate">Activate</UButton>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
const valid = ref(false)
const licenseKey = ref("")
const activate = () => { valid.value = licenseKey.value.length > 10 }
</script>