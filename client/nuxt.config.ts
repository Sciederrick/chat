// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@pinia/nuxt"],
  css: ["@/assets/index.css"],
  runtimeConfig: {
    public: {
      serverURL: "http://localhost:3098/api/v1"
    }
  },
  ssr: false,
});
