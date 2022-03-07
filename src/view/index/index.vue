<template>
  <el-container>
    <!-- <el-header>
      <img src="../assets/logo.png" alt="">
    </el-header> -->
    <el-container>
      <!-- <el-button @click="testWeb">testWeb</el-button> -->
      <!-- <el-button @click="testCategory">testCategory</el-button> -->
      <el-aside width="201px">
        <Aside :menu="asideTree" :active="active" />
      </el-aside>
      <el-main>
        <Main :menu="mainTree" :active="active" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Main from './components/main.vue'
import Aside from './components/aside.vue'
// import data from '@/db/db.json'

import fractionalIndex from 'fractional-index'
import { post } from '@/api'

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
    this.init()
  },

  methods: {
    async init (val) {
      const { category, web } = await import('@/db/db.json')

      let asideTree = toTree(category, category, 'children')
      asideTree = asideTree.sort((a, b) => {
        return a.index < b.index ? -1 : 1
      })
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
    },

    async testCategory () {
      window.index = async function (arr) {
        let index = null
        for (let i = 0; i < arr.length; i++) {
          const url = '/update-category'
          const newIndex = fractionalIndex(index, null)
          index = newIndex

          await new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 1000)
          })

          await post(url, {
            id: arr[i].id,
            index: newIndex
          })

          if (arr[i].children) {
            await window.index(arr[i].children)
          }
        }
      }
      window.index(this.asideTree)
    },

    async testWeb () {
      window.index = async function (arr, t) {
        let index = null
        for (let i = 0; i < arr.length; i++) {
          const url = '/update-web'
          const newIndex = fractionalIndex(index, null)
          index = newIndex

          await new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 1000)
          })

          if (arr[i].web) {
            await window.index(arr[i].web, 2)
          }

          if (t === 2) {
            await post(url, {
              id: arr[i].id,
              index: newIndex
            })
          }
        }
      }
      window.index(this.mainTree)
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
