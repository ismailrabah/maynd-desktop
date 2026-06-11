<template>
  <div class="space-y-8">
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold mb-4">Welcome to Maynd.ma</h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto">Your 100% offline AI assistant</p>
      <div class="flex gap-4 justify-center mt-8">
        <UButton to="/chat" size="lg" class="bg-green-500">Start Chatting</UButton>
        <UButton to="/documents" variant="outline" size="lg">Upload Documents</UButton>
      </div>
    </section>
  </div>
</template>