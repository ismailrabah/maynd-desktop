<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">About Maynd.ma</h1>
    <p class="text-gray-400 mb-8">Maynd.ma is a 100% offline AI assistant for Moroccan professionals including fiduciaires, medical clinics, and legal offices.</p>
    <h2 class="text-2xl font-bold mb-4">Features</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="f in features" :key="f.title" variant="ghost">
        <template #header><UIcon :name="f.icon" class="text-2xl text-green-500" /></template>
        <h3 class="font-semibold">{{ f.title }}</h3>
        <p class="text-sm text-gray-400">{{ f.desc }}</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'i-heroicons-wifi-slash', title: '100% Offline', desc: 'No internet required' },
  { icon: 'i-heroicons-shield-check', title: 'Private', desc: 'All data stays on your machine' },
  { icon: 'i-heroicons-cpu-chip', title: 'Fast', desc: 'Instant responses' },
  { icon: 'i-heroicons-globe-alt', title: 'Multi-Language', desc: 'FR, AR, EN support' }
]
</script>