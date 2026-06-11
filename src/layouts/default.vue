<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <header class="border-b border-gray-800 px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
            <span class="text-xl font-bold text-black">M</span>
          </div>
          <span class="text-xl font-bold">Maynd.ma</span>
        </NuxtLink>
        <nav class="flex gap-6">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/chat">Chat</NuxtLink>
          <NuxtLink to="/documents">Documents</NuxtLink>
          <NuxtLink to="/settings">Settings</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/help">Help</NuxtLink>
          <NuxtLink to="/license">License</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>
    <footer class="border-t border-gray-800 px-6 py-4 text-center text-gray-500">
      &copy; 2026 Maynd.ma. All rights reserved.
    </footer>
  </div>
</template>