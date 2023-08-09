<template>
  <div class="typing">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
.typing {
  position: relative;
}

.typing span {
  content: '';
  animation: blink 1.5s infinite;
  animation-fill-mode: both;
  height: 10px;
  width: 10px;
  background: #ED2647;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
}

.typing span:nth-child(2) {
  animation-delay: .2s;
  margin-left: 15px;
}

.typing span:nth-child(3) {
  animation-delay: .4s;
  margin-left: 30px;
}

@keyframes blink {
  0% {
    opacity: .1;
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: .1;
  }
}
</style>