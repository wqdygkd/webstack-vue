<template>
  <div class="main">
    <div>👋Hi, Tahlia!</div>

    <!-- TODO: 搜索 -->

    <!-- TODO: 推广 -->
    <template v-for="item in menu">
      <div v-if="!(item.id === '0' && (!item.web || item.web.length == 0))" :id="item.name" :key="item.id" class="item">
        <div class="title">
          <!-- <i :class="item.icon" class="icon"></i> -->
          <i class="fa fa-tag icon" />
          {{ item.name }}
        </div>

        <el-row v-if="item.web && item.web.length > 0" :gutter="20">
          <!-- TODO: 第一个收藏展示谷歌广告 -->
          <el-col v-for="i in item.web" :key="i.id" :span="6" class="web-item">
            <div class="web-item-inner">
              <el-image class="logo" lazy :src="getLogo(i.logo)" fit="fit">
                <div slot="error" class="image-error">{{ i.name.slice(0, 1) }}</div>
              </el-image>
              <div class="right">
                <p class="name overflowClip_1">
                  <strong>{{ i.name }}</strong>
                </p>
                <p class="desc overflowClip_2">{{ i.desc }}</p>
              </div>
              <el-popover
                placement="bottom-start"
                width="70"
                class="operate"
                popper-class="operate-popper"
              >
                <li class="el-dropdown-menu__item" @click="del(i)">删除</li>
                <li class="el-dropdown-menu__item" @click="edit(i)">编辑</li>
                <i slot="reference" class="fa fa-ellipsis-h" />
              </el-popover>
            </div>
          </el-col>
        </el-row>
        <br>
      </div>
    </template>

    <el-button class="add" type="primary" @click="addWeb()">添加</el-button>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="reset">
      <el-form ref="form" :model="form">
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="请选择" clearable>
            <el-option
              v-for="item in menu"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="logo">
          <el-input v-model="form.logo" />
        </el-form-item>
        <el-form-item label="desc">
          <el-input v-model="form.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="confirm">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post } from '@/api'
export default {
  props: {
    menu: {
      type: Array,
      default: () => {}
    },
    active: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      title: '新增',
      form: {
        name: '',
        url: '',
        logo: '',
        desc: '',
        categoryId: ''
      }
    }
  },

  methods: {
    getLogo (logo) {
      try {
        return process.env.NODE_ENV === 'development' ? require('../assets/images/logos/' + logo) : 'https://cdn.jsdelivr.net/gh/cuilongjin/webstack@main/assets/images/logos/' + logo
      } catch (error) {
        console.log(error)
        return ''
      }
    },
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
    },
    addWeb () {
      this.dialogFormVisible = true
    },

    async confirm () {
      const url = this.form.id ? '/update-web' : '/add-web'
      const res = await post(url, this.form)
      if (res.code === 0) {
        this.dialogFormVisible = false
        // this.$emit('update')
      }
    },

    handleOperate (command, t) {
      this[command](t)
    },

    del (t) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await post('/delete-web', { id: t.id })
        if (res.code === 0) {
          // this.$emit('update')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    edit (t) {
      this.dialogFormVisible = true
      this.form = { ...t }
    },

    reset () {
      this.form.name = ''
      this.form.id = ''
      this.form.url = ''
      this.form.logo = ''
      this.form.desc = ''
      this.form.categoryId = ''
    }
  }
}
</script>

<style scoped lang="less">
.item {
  min-height: 100px;
  .title {
    font-size: 17px;
    color: #555;
    margin: 9px 0;
  }
  .el-row {
    // margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .web-item {
    // position: relative;
    padding: 10px;
    .web-item-inner {
      position: relative;
      border-radius: 4px;
      height: 51px;
      padding: 15px;
      display: flex;
      border: 1px solid #e4ecf3;
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 13px 40px -24px #0024644d;
      }

      /deep/.logo {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        img {
          width: 40px;
          height: 40px;
        }
        .image-error {
          width: 40px;
          height: 40px;
          background: #e9e9e9;
          font-size: 20px;
          text-align: center;
          line-height: 40px;
        }
      }
      .right {
        flex: 1;
        .name, .desc {
          font-size: 13px;
        }
        .desc {
          color: #979898;
        }
      }

      .operate {
        position: absolute;
        right: 15px;
        top: 7px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        transition: 0.5s;
        &:hover {
          background: rgba(55,53, 47,0.08);
        }
      }
    }
  }

}
.add {
  position: fixed;
  top: 10px;
  right: 15px;
}

p {
  margin: 0;
}
.overflowClip_1 {
  overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.overflowClip_2 {
  overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>

<style lang="less">
.operate-popper {
  min-width: 70px;
}
</style>
