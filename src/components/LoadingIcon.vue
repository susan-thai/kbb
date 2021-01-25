<template>
  <div class="loading-dots">
    <div class="loading-dots--dot"></div>
    <div class="loading-dots--dot"></div>
    <div class="loading-dots--dot"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingIcon",
};
</script>

<style scoped>
@-webkit-keyframes dot-keyframes {
  0% {
    opacity: 0.4;
    transform: scale(1, 1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2, 1.2);
  }
  100% {
    opacity: 0.4;
    transform: scale(1, 1);
  }
}
@keyframes dot-keyframes {
  0% {
    opacity: 0.4;
    transform: scale(1, 1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2, 1.2);
  }
  100% {
    opacity: 0.4;
    transform: scale(1, 1);
  }
}
.loading-dots {
  text-align: center;
  width: 100%;
}
.loading-dots--dot {
  -webkit-animation: dot-keyframes 1.5s infinite ease-in-out;
  animation: dot-keyframes 1.5s infinite ease-in-out;
  background-color: #0799f8;
  border-radius: 10px;
  display: inline-block;
  height: 10px;
  width: 10px;
  margin: 0 8px;
}
.loading-dots--dot:nth-child(2) {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.loading-dots--dot:nth-child(3) {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
</style>