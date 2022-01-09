<template>
    <el-menu :default-active="active.key" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item :index="item.key" v-for="item in menu" :key="item.key" >
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  props: {
    menu: Array,
    active: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isCollapse: false
    }
  },

  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style scoped>

</style>
