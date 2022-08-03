<template>
  <div class="section">
    <el-upload
      v-if="type === 1"
      class="el-upload upload-file"
      :show-file-list="false"
      action=""
      :http-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="logo">
      <el-button v-else>上传</el-button>
    </el-upload>

    <el-input v-if="type === 2" v-model="url" />

    <el-button v-if="type === 2" @click="type = 1">上传</el-button>
    <el-button v-if="type === 1" @click="type = 2">替换</el-button>
  </div>
</template>
<script>
import { post } from '@/api'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      url: '',
      type: 1
    }
  },
  computed: {
    imageUrl () {
      return this.value
    }
  },
  watch: {
    imageUrl: {
      handler (newVal) {
        this.url = newVal
      },
      immediate: true
    },
    url: {
      handler (newVal) {
        this.$emit('change', newVal)
      }
    }
  },

  methods: {
    beforeUpload (file) {
      const maxSize = 5
      const overSizeLimit = maxSize ? file.size / 1024 / 1024 > maxSize : false
      if (overSizeLimit) {
        this.$message.error(`文件大小不能超过${maxSize}M！`)
        return false
      }
      return true
    },

    async handleUpload (options) {
      const formData = new FormData()
      formData.append('file', options.file)
      formData.append('strategy_id', 8)
      const res = await post('https://imgs.top/api/v1/upload', formData)
      if (res.status === true) {
        this.$emit('change', res.data.links.url)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.logo {
  width: 100px;
  height: 100px;
}
</style>
