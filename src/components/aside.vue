<template>
  <div class="aside">
    <el-menu
      :default-active="active"
      :router="true"
      :collapse="isCollapse"
      background-color="#2c2e2f"
      text-color="#979898"
      active-text-color="#fff"
      :unique-opened="true"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="item in menu">
        <el-submenu v-if="item.children && item.children.length > 0" :key="item.id" :index="item.id">
          <template slot="title">
            <i :class="item.icon" class="icon" />
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="item in item.children" :key="item.id" :index="'#' + item.name">
            <a :href="'#' + item.name">{{ item.name }}</a>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="'#' + item.name">
          <i class="el-icon-menu" />
          <a :href="'#' + item.name">{{ item.name }}</a>
          <el-dropdown trigger="click" class="operate">
            <span class="el-dropdown-link">
              <i class="el-icon-s-tools el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                <el-button type="" @click="del(item)">
                  删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                <el-button type="" @click="edit(item)">
                  编辑
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </template>

      <el-button type="primary" @click="addCategory()">
        添加
      </el-button>
    </el-menu>

    <el-dialog title="title" :visible.sync="dialogFormVisible" @close="reset">
      <el-form ref="form" :model="form">
        <el-form-item label="上级">
          <el-select v-model="form.parentId" placeholder="请选择" clearable>
            <el-option
              v-for="item in menu"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" />
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
      }
    }
  },

  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    addCategory () {
      this.dialogFormVisible = true
    },
    async confirm () {
      const url = this.form.id ? '/update-category' : '/add-category'
      const res = await post(url, this.form)
      if (res.code === 0) {
        this.dialogFormVisible = false
        // this.$emit('update')
      }
    },

    del (t) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await post('/delete-category', { id: t.id })
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
      this.form.icon = ''
      this.form.parentId = ''
    }
  }
}
</script>
<style scoped lang="less">
.aside {
  height: 100%;
  .el-menu-item {
    &.is-active {
      a {
        color: #fff;
      }
    }
    a {
      text-decoration: none;
      color: #979898;
    }
  }

  .icon {
    margin-right: 10px;
  }
}
</style>
