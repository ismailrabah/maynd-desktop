<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t("app.title"), meta: [{ name: "description", content: t("app.description") }] })
</script>