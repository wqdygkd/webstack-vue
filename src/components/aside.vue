<template>
  <div class="aside">
    <el-menu
      :default-active="active"
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

            <el-popover
              v-if="isDev"
              placement="bottom-start"
              width="70"
              class="operate"
              popper-class="operate-popper"
              trigger="hover"
            >
              <li class="el-dropdown-menu__item" @click="del(item)">删除</li>
              <li class="el-dropdown-menu__item" @click="edit(item)">编辑</li>
              <i slot="reference" class="fa fa-ellipsis-h" />
            </el-popover>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.id" :index="'#' + child.name">
            <a :href="'#' + child.name">{{ child.name }}</a>

            <el-popover
              v-if="isDev"
              placement="bottom-start"
              width="70"
              class="operate"
              trigger="hover"
              popper-class="operate-popper"
            >
              <li class="el-dropdown-menu__item" @click="del(child)">删除</li>
              <li class="el-dropdown-menu__item" @click="edit(child)">编辑</li>
              <i slot="reference" class="fa fa-ellipsis-h" />
            </el-popover>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="'#' + item.name">
          <i :class="item.icon" class="icon" />
          <a :href="'#' + item.name">{{ item.name }}</a>

          <el-popover
            v-if="isDev"
            placement="bottom-start"
            width="70"
            class="operate"
            trigger="hover"
            popper-class="operate-popper"
          >
            <li class="el-dropdown-menu__item" @click="del(item)">删除</li>
            <li class="el-dropdown-menu__item" @click="edit(item)">编辑</li>
            <i slot="reference" class="fa fa-ellipsis-h" />
          </el-popover>
        </el-menu-item>
      </template>
      <div v-if="isDev" class="add">
        <el-button type="primary" @click="addCategory()">添加</el-button>
      </div>
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
import { post } from '@/api'
export default {
  inject: ['isDev'],
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
    position: relative;
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

  .operate {
      position: absolute;
      right: 33px;
      top: 17px;
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

  .icon {
    margin-right: 10px;
  }

  .add {
    text-align: center;
  }
}
</style>
