<template>
  <div class="main">
    <div>
      👋Hi, Tahlia!
    </div>
    <div
      v-for="item in menu"
      :key="item.id"
      class="item"
      :id="item.name"
    >

      <div class="title">
        <!-- <i :class="item.icon" class="icon"></i> -->
        <i class="fa fa-tag icon" ></i>
        {{item.name}}
      </div>



      <el-row :gutter="20" v-if="item.web && item.web.length > 0">
        <el-col :span="6" v-for="i in item.web" :key="i.id" class="web-item">
            <div class="web-item-inner">
              <el-image class="logo" lazy src="https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg" fit="fit" alt="" ></el-image>
              <div class="right">
                <p class="name overflowClip_1">
                  <strong>{{i.name}}</strong>
                </p>
                <p class="desc overflowClip_2">片库网是一个可在线观看、下载视频的网站。每日收集全网最新的电影、剧集、动漫高清资源供网友免费下载！</p>
              </div>
            </div>
            <!-- <el-dropdown trigger="click" class="operate">
              <span class="el-dropdown-link">
                <i class="el-icon-s-tools  el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  <el-button @click="del(i)" type="">删除</el-button>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  <el-button @click="edit(i)" type="">编辑</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
        </el-col>
      </el-row>
      <br />
    </div>

    <el-button class="add" type="primary" @click="addWeb()">添加</el-button>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="reset">
      <el-form :model="form" ref="form">
        <el-form-item label="分类" >
          <el-select v-model="form.categoryId" placeholder="请选择" clearable>
            <el-option :label="item.name" :value="item.id" v-for="item in menu" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <el-input v-model="form.logo"></el-input>
        </el-form-item>
        <el-form-item label="desc">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false,
      title: '新增',
      form: {
          name: '',
          url: '',
          logo: '',
          desc: '',
          categoryId: ''
        },
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
    },
    addWeb() {
      this.dialogFormVisible = true
    },

    async confirm() {
      let url = this.form.id ? '/update-web' : '/add-web'
      let res = await post(url, this.form)
      if (res.code === 0) {
        this.dialogFormVisible = false
        // this.$emit('update')
      }
    },

    del(t) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await post('/delete-web', { id: t.id})
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

    edit(t) {
      this.dialogFormVisible = true
      this.form = {...t}
    },




    reset() {
      this.form.name= ''
      this.form.id= ''
      this.form.url= ''
      this.form.logo= ''
      this.form.desc= ''
      this.form.categoryId= ''
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
    position: relative;
    padding: 10px;
    .web-item-inner {
      border-radius: 4px;
      min-height: 36px;
      // background: #d3dce6;
      // background: #f9fafc;
      padding: 15px;
      display: flex;
      align-items: center;
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
    }

    .operate {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
  }

}
.add {
  position: fixed;
  top: 0;
  right: 0;
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
