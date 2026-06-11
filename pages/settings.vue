<template>
  <div class="max-w-3xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-8">Settings</h1>
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">AI Settings</h2>
      <UFormGroup label="Model Path">
        <UInput v-model="modelPath" placeholder="./models/" />
      </UFormGroup>
      <UFormGroup label="Server Path">
        <UInput v-model="serverPath" placeholder="./sidecar/llama-server" />
      </UFormGroup>
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Context Length"><UInput v-model.number="contextLength" type="number" /></UFormGroup>
        <UFormGroup label="Threads"><UInput v-model.number="threads" type="number" /></UFormGroup>
        <UFormGroup label="Temperature"><UInput v-model.number="temperature" type="number" step="0.1" /></UFormGroup>
        <UFormGroup label="GPU Layers"><UInput v-model.number="gpuLayers" type="number" /></UFormGroup>
      </div>
      <UButton @click="saveSettings">Save Settings</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const modelPath = ref("./models")
const serverPath = ref("./sidecar/llama-server")
const contextLength = ref(4096)
const threads = ref(4)
const temperature = ref(0.7)
const gpuLayers = ref(0)
const saveSettings = () => console.log("Settings saved")
</script>