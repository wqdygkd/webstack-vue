<template>
  <div>
    <el-menu :default-active="active" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <template v-for="item in menu" >
        <el-submenu index="1" v-if="item.children && item.children.length > 0"  :key="item.id" >
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
        </el-menu-item>
      </template>

      <el-button type="primary" @click="addCategory()">添加</el-button>
    </el-menu>

    <el-dialog title="title" :visible.sync="dialogFormVisible">
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
      let res = await post('/add-category', this.form)
      if (res.code === 0) {
        this.dialogFormVisible = false
        this.$emit('update')
      }
    }
  }
}
</script>
<style scoped>

</style>
