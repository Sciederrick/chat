import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const { socketUrl } = nuxtApp.$config.public;
  nuxtApp.socket = io(socketUrl);
});