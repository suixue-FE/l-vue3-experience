<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button @click="add">click</button>
    <h1>count is {{ count }}</h1>
    <h1>double is {{ double }}</h1>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { ref, computed } from 'vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    let { count, add, double } = useCount(1)
    return { count, add, double }
  },
}

// 可拆成单独文件，取代vue2的声明周期
function useCount(init) {
  let count = ref(init)
  let add = () => {
    count.value++
  }
  let double = computed(() => {
    return count.value * 2
  })
  return { count, add, double }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
