<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>

<style scoped>
body {
  margin: 0;
}
#app {
  height: 100vh;
}
.el-container, .el-menu {
  height: 100%;
}
</style>
