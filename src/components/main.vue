<template>
  <div class="main">
    <div v-for="item in menu" :key="item.id" class="item" :id="item.id">
      {{item.name}}
    </div>
  </div>
</template>

<script>
import { post, get } from '@/api'
export default {
  props: {
    menu: Array,
    active: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: []
    }
  },

  methods: {
    beforeUpload () {
      // console.log(file)
    },
    upload (file) {
      const data = new FormData()
      data.append('file', file.file)
      post(this.active.url, data)

      // get('https://api.open.qq.com/tfs/download_nologin.php?uuid=gaitubao_5602_png.png%7C5242880%7C1641571133.4566%7Cfromcos').then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style scoped>

.item {
  height: calc(100vh - 60px);
}
</style>
