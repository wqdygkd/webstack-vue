<template>
    <el-container>
      <el-header>
        <img src="../assets/logo.png" alt="">
      </el-header>
      <el-container>
        <el-aside width="201px">
          <Aside :menu="menu" :active="active"/>
        </el-aside>
        <el-main>
          <Main msg="Welcome to Your Vue.js App" :active="active" />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import Main from '@/components/main.vue'
import Aside from '@/components/aside.vue'

export default {
  components: {
    Main,
    Aside
  },

  computed: {
    active () {
      const { type } = this.$route.params
      if (type) {
        return this.menu.find(item => { return item.key === type })
      }
      return this.menu[0]
    }
  },

  data () {
    return {
      menu: [
        {
          key: 'qq',
          name: 'qq',
          url: '/api/upload/qq.php',
          desc: '图片有压缩，最大可上传 5120 KB'
        },
        {
          key: 'qq1',
          name: 'qq1',
          url: '/api/upload/qq1.php'
        },
        {
          key: 'qq2',
          name: 'qq2',
          url: '/api/upload/qq2.php'
        },
        {
          key: 'qq3',
          name: 'qq3',
          url: '/api/upload/qq3.php'
        },
        {
          key: 'bd1',
          name: 'bd1',
          url: '/api/upload/bd1.php'
        },
        {
          key: 'bd2',
          name: 'bd2',
          url: '/api/upload/bd2.php'
        },
        {
          key: 'tt1',
          name: 'tt1',
          url: '/api/upload/tt1.php'
        },
        {
          key: '581',
          name: '581',
          url: '/api/upload/581.php'
        },
        {
          key: 'ali1',
          name: 'ali1',
          url: '/api/upload/ali1.php'
        },
        {
          key: 'jd1',
          name: 'jd1',
          url: '/api/upload/jd1.php'
        },
      ]
    }
  }
}
</script>

<style>
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
