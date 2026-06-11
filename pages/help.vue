<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-8">Help Center</h1>
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">Getting Started</h2>
      <div class="space-y-4">
        <UCard v-for="(step, i) in steps" :key="i" variant="ghost">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">{{ i + 1 }}</div>
              <h3>{{ step.title }}</h3>
            </div>
          </template>
          <p>{{ step.desc }}</p>
        </UCard>
      </div>
    </section>
    <section>
      <h2 class="text-lg font-semibold mb-4">Contact Us</h2>
      <div class="grid grid-cols-3 gap-4">
        <UCard variant="ghost"><template #header><UIcon name="i-heroicons-envelope" class="text-2xl" /></template><p>support@maynd.ma</p></UCard>
        <UCard variant="ghost"><template #header><UIcon name="i-heroicons-globe-alt" class="text-2xl" /></template><p>https://maynd.ma</p></UCard>
        <UCard variant="ghost"><template #header><UIcon name="i-heroicons-phone" class="text-2xl" /></template><p>+212 520 123 456</p></UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { title: 'Set Up Settings', desc: 'Configure your preferences in Settings page.' },
  { title: 'Load AI Model', desc: 'Download GGUF model to models/ folder.' },
  { title: 'Start Chatting', desc: 'Go to Chat page and ask questions.' },
  { title: 'Import Documents', desc: 'Upload documents in Documents page.' }
]
</script>