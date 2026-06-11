<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Documents</h1>
      <UButton @click="showUpload = true">Upload</UButton>
    </div>
    <UModal v-model="showUpload">
      <UCard>
        <template #header><h2>Upload Document</h2></template>
        <div class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center" @drop.prevent="handleDrop" @dragover.prevent="dragover = true">
          <UIcon name="i-heroicons-cloud-arrow-up" class="text-4xl mb-4" />
          <p>Drag and drop files here</p>
          <UButton class="mt-4" @click="selectFile">Select File</UButton>
          <input ref="fileInput" type="file" class="hidden" @change="handleFile" />
        </div>
      </UCard>
    </UModal>
    <div class="border border-gray-700 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-900"><tr><th class="text-left p-4">Name</th><th class="text-left p-4">Size</th><th class="text-left p-4">Status</th></tr></thead>
        <tbody><tr v-for="d in docs" :key="d.name"><td class="p-4">{{ d.name }}</td><td class="p-4">{{ d.size }}</td><td class="p-4"><UBadge :color="d.processed ? 'green' : 'gray'">{{ d.processed ? 'Processed' : 'Pending' }}</UBadge></td></tr></tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const showUpload = ref(false)
const dragover = ref(false)
const fileInput = ref(null)
const docs = ref([])
const selectFile = () => fileInput.value.click()
const handleFile = (e) => { docs.value.push({ name: e.target.files[0].name, size: e.target.files[0].size, processed: false }); showUpload.value = false }
const handleDrop = (e) => { dragover.value = false; handleFile({ target: { files: e.dataTransfer.files } }) }
</script>