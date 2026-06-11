<template>
  <UDropdown :items="languages" :popper="{ placement: 'bottom-end' }">
    <UButton variant="ghost">{{ currentLang.name }}</UButton>
    <template #item="{ item }">
      <div class="flex justify-between w-full" @click="switchLang(item.code)">
        <span>{{ item.name }}</span>
        <span class="text-gray-500">{{ item.code }}</span>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const languages = computed(() => locales.value.map(l => ({ code: l.code, name: l.name })))
const currentLang = computed(() => languages.value.find(l => l.code === locale.value) || languages.value[0])
const switchLang = (code) => { locale.value = code; window.location.reload() }
</script>