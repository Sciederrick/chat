// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@pinia/nuxt"],
  css: ["@/assets/index.css"],
  runtimeConfig: {
    public: {
      serverUrl: process.env.SERVER_URL,      
      socketUrl: process.env.SOCKET_URL      
    }
  },
  ssr: false,
});
