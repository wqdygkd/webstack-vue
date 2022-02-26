<template>
  <el-container>
    <!-- <el-header>
      <img src="../assets/logo.png" alt="">
    </el-header> -->
    <el-container>
      <el-aside width="201px">
        <Aside :menu="asideTree" :active="active" @update="update"/>
      </el-aside>
      <el-main>
        <Main :menu="mainTree" :active="active"  />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Main from '@/components/main.vue'
import Aside from '@/components/aside.vue'
// import data from '@/db/db.json'

import {toTree} from '@/utils'
export default {
  components: {
    Main,
    Aside
  },

  computed: {
    active () {
      const { hash } = this.$route
      return decodeURIComponent(hash)
    }
  },

  data () {
    return {
      active: '',
      asideTree: [],
      mainTree: [],
    }
  },
  created() {
    this.update()
  },

  methods: {
    async update(val) {
      let {category, web } = await import('@/db/db.json')

      let asideTree = toTree(category, category, 'children')
      this.asideTree = asideTree

      let mainTree = []
      asideTree.forEach(item => {
        let { children } = item
        if (children && children.length > 0 ) {
          children.forEach(item => {
            mainTree.push({ ...item })
          })
        } else {
          mainTree.push({ ...item })
        }
      })

      let map = new Map()
      mainTree.forEach(i => {
        map[i.id] = i
      })

      web.forEach(item => {
        if(!map[item.categoryId].web) {
          map[item.categoryId].web = [item]
        } else {
          map[item.categoryId].web.push(item)
        }
      })

      this.mainTree = mainTree
    },
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
