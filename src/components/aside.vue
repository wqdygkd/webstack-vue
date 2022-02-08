<template>
  <div class="aside">
    <el-menu :default-active="active" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <template v-for="item in menu" >
        <el-submenu :index="item.id" v-if="item.children && item.children.length > 0"  :key="item.id" >
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.name}}</span>
          </template>
            <el-menu-item :index="'#' + item.name"  v-for="item in item.children" :key="item.id">
              <i class="el-icon-location"></i>
              <a :href="'#' + item.name">{{item.name}}</a>
            </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="'#' + item.name"  :key="item.id" >
          <i class="el-icon-menu"></i>
          <a :href="'#' + item.name">{{item.name}}</a>
          <el-dropdown trigger="click" class="operate">
                <span class="el-dropdown-link">
                  <i class="el-icon-s-tools  el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="clearfix">
                    <el-button @click="del(item)" type="">删除</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item class="clearfix">
                    <el-button @click="edit(item)" type="">编辑</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
        </el-menu-item>
      </template>

      <el-button type="primary" @click="addCategory()">添加</el-button>
    </el-menu>

    <el-dialog title="title" :visible.sync="dialogFormVisible" @close="reset">
      <el-form :model="form" ref="form">
        <el-form-item label="上级" >
          <el-select v-model="form.parentId" placeholder="请选择" clearable >
            <el-option :label="item.name" :value="item.id" v-for="item in menu" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图标" >
          <el-input v-model="form.icon"></el-input>
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
// import db from '../db/index.mjs'
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
      isCollapse: false,
      dialogFormVisible: false,
      title: '新增',
      form: {
        name: '',
        icon: '',
        parentId: ''
      },
    }
  },

  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    addCategory() {
      this.dialogFormVisible = true
    },
    async confirm() {
      let url = this.form.id ? '/update-category' : '/add-category'
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
        let res = await post('/delete-category', { id: t.id})
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
      this.form.icon= ''
      this.form.parentId= ''
    }
  }
}
</script>
<style scoped lang="less">
.aside {
  height: 100%;
  a {
    text-decoration: none;
    color: #333;
  }
}
</style>
