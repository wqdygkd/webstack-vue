<template>
  <el-container>
    <!-- <el-header>
      <img src="../assets/logo.png" alt="">
    </el-header> -->
    <el-container>
      <el-aside width="201px">
        <Aside :menu="asideTree" :active="active" @update="update" />
      </el-aside>
      <el-main>
        <Main :menu="mainTree" :active="active" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Main from '@/components/main.vue'
import Aside from '@/components/aside.vue'
// import data from '@/db/db.json'

import { toTree } from '@/utils'
export default {
  components: {
    Main,
    Aside
  },

  provide () {
    return {
      isDev: process.env.NODE_ENV === 'development' && !this.$route.query.preview
    }
  },

  data () {
    return {
      // active: '',
      asideTree: [],
      mainTree: []
    }
  },

  computed: {
    active () {
      const { hash } = this.$route
      return decodeURIComponent(hash)
    }
  },
  created () {
    this.update()
  },

  methods: {
    async update (val) {
      const { category, web } = await import('@/db/db.json')

      const asideTree = toTree(category, category, 'children')
      this.asideTree = asideTree

      const mainTree = [{ id: '0', name: '未分类' }]
      asideTree.forEach(item => {
        const { children } = item
        if (children && children.length > 0) {
          children.forEach(item => {
            mainTree.push({ ...item })
          })
        } else {
          mainTree.push({ ...item })
        }
      })

      const map = new Map()
      mainTree.forEach(i => {
        map[i.id] = i
      })

      web.forEach(item => {
        const id = map[item.categoryId] ? item.categoryId : '0'

        if (!map[id].web) {
          map[id].web = [item]
        } else {
          map[id].web.push(item)
        }
      })

      this.mainTree = mainTree
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
.el-main {
  box-sizing: border-box;
}
</style>
