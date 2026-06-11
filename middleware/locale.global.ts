export default defineNuxtRouteMiddleware((to) => {
  const locale = to.path.split('/')[1]
  const supported = ['fr', 'ar', 'en']
  if (!supported.includes(locale)) {
    const { locale: current } = useI18n()
    if (current.value !== 'fr') return navigateTo('/' + current.value + to.path)
  }
})