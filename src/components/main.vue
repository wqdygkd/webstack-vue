<template>
  <div class="main">
    <el-upload
      class="upload-demo"
      drag
      action=""
      :http-request="upload"
      multiple
      :before-upload="beforeUpload"
      :show-file-list="false"
      accept="image/*"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">{{active.desc}}</div>
    </el-upload>
  </div>
</template>

<script>
import { post, get } from '@/api'
export default {
  props: {
    active: {
      type: Object,
      default: () => {}
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
</style>
