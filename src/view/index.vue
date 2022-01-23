<template>
    <el-container>
      <!-- <el-header>
        <img src="../assets/logo.png" alt="">
      </el-header> -->
      <el-container>
        <el-aside width="201px">
          <Aside :menu="menu" :active="active" @update="update"/>
        </el-aside>
        <el-main>
          <Main  :active="active" :menu="menu"  />
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
      const { hash } = this.$route
      return decodeURIComponent(hash)
    }
  },

  data () {
    return {
      menu: [
        {
          name: '常用推荐',
          icon: 'fa fa-star-o',
          web: [],
        },
        {
          name: '影视资源',
          icon: 'fa fa-video-camera',
          children: [
            {
              name: '影视站',
              web: [
                {
                  url: 'https://www.nfmovies.com/',
                  logo: 'assets/images/logos/nfmovies.webp',
                  title: '奈菲影视',
                  desc: '永久免费的福利超清影视站，没有套路，完全免费！'
                },
              ]
            },
          ]
        },
        {
          name: '常用推荐1',
          icon: 'fa fa-star-o',
          web: [],
        },
      ]
    }
  },

  methods: {
    update(val) {
      console.log(val)

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
  /* height:  calc(100vh - 60px); */
  box-sizing: border-box;
}
</style>
