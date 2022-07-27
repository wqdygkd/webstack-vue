<template>
  <div class="aside" :class="{ collapse: isCollapse }">
    <div class="top-bar">
      <div class="menu" @click="changeAside(false)">菜单</div>
      <div class="logo">
        <el-image :src="require('@/assets/logo.png')" />
      </div>
    </div>

    <div class="v-modal" />

    <el-scrollbar>
      <div class="collapse-btn" @click="changeAside(true)">x</div>
      <div class="logo">
        <el-image :src="require('@/assets/logo.png')" />
      </div>
      <el-menu :default-active="active" :unique-opened="true">
        <template v-for="item in menu">
          <el-submenu
            v-if="item.children && item.children.length > 0"
            :key="item.id"
            :index="item.id"
          >
            <template slot="title">
              <i :class="item.icon" class="icon" />
              <span>{{ item.name }}</span>

              <!-- <Popover
              v-if="isDev"
              class="operate"
              :index="index"
              :menu="menu"
              @edit="editCategory(item)"
              @move="moveCategory($event, menu, index)"
            /> -->
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="'#' + child.name"
            >
              <a :href="'#' + child.name">{{ child.name }}</a>

              <!-- <Popover
              v-if="isDev"
              class="operate"
              :index="childIndex"
              :menu="item.children"
              @del="delCategory(child)"
              @edit="editCategory(child)"
              @move="moveCategory($event, item.children, childIndex)"
            /> -->
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :key="item.id" :index="'#' + item.name">
            <i :class="item.icon" class="icon" />
            <a :href="'#' + item.name">{{ item.name }}</a>

            <!-- <Popover
            v-if="isDev"
            class="operate"
            :index="index"
            :menu="menu"
            @del="delCategory(item)"
            @edit="editCategory(item)"
            @move="moveCategory($event, menu, index)"
          /> -->
          </el-menu-item>
        </template>
        <!-- <div v-if="isDev" class="add">
          <el-button type="primary" @click="addCategory()">添加</el-button>
        </div> -->
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>
<script>
// import db from '../db/index.mjs'
import { post } from '@/api'
import fractionalIndex from 'fractional-index'

// import Popover from './popover.vue'
export default {
  components: {
    // Popover
  },
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
      isCollapse: true,
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
    changeAside (flag) {
      this.isCollapse = flag
    },

    addCategory () {
      this.dialogFormVisible = true
    },
    editCategory (t) {
      this.dialogFormVisible = true
      this.form = { ...t }
    },
    delCategory (t) {
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
    async moveCategory (type, menu, index) {
      const url = '/update-category'
      const item = menu[index]

      if (type === 1) {
        const A = menu[index - 2]?.index || null
        const B = menu[index - 1]?.index
        index = fractionalIndex(A, B)
        console.log(A, B, index)
      } else if (type === 2) {
        const A = menu[index + 2]?.index || null
        const B = menu[index + 1]?.index
        index = fractionalIndex(A, B)
        console.log(A, B, index)
      }

      await post(url, {
        id: item.id,
        index
      })
    },
    async confirm () {
      const url = this.form.id ? '/update-category' : '/add-category'
      const res = await post(url, this.form)
      if (res.code === 0) {
        this.dialogFormVisible = false
      }
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
@height: 40px;
@textColor: #979898;
@textColorActive: #2c2e2f;
@bgColor: #fff;
@width: 220px;

.aside {
  width: @width;
  background: #f1f5f8;
  .v-modal {
    display: none;
  }
  @media screen and (max-width: 850px) {
    width: 100%;
    z-index: 1;
    .v-modal {
      position: fixed;
      display: block;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background: #000;
      transition: all 0.5s;
    }
    .el-scrollbar__wrap {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }

    &.collapse {
      .v-modal {
        opacity: 0;
        pointer-events: none;
      }
      .el-scrollbar {
        left: -@width;
      }
    }
  }
}

.top-bar {
  display: none;
  background: @bgColor;
  @media screen and (max-width: 850px) {
    display: flex;
  }
  height: @height;
  width: 100%;

  position: relative;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 20px 0 #d4dee6;
  .menu {
    position: absolute;
    left: 0;
  }
  .logo {
    width: 40px;
    height: 40px;
  }
}

.el-scrollbar {
  transition: all 0.5s;
  box-shadow: 0 0 18px 0 #d4dee6;
  background: @bgColor;
  position: absolute;
  width: @width;
  left: 0;
  top: 0;
  height: 100%;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .collapse-btn {
    display: none;
    @media screen and (max-width: 850px) {
      display: block;
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
      background: rgba(55, 53, 47, 0.08);
    }
  }

  .icon {
    margin-right: 10px;
  }
}

.el-menu {
  height: 100%;
  border: none;
  .el-menu-item {
    background-color: @bgColor !important;
    height: @height;
    line-height: @height;
    &.is-active,
    &:hover {
      i,
      a {
        color: @textColorActive;
      }
    }
    i,
    a {
      transition: all 0.5s;
      color: @textColor;
      text-decoration: none;
    }
  }
  /deep/.el-submenu {
    .el-submenu__title {
      height: @height;
      line-height: @height;
      background-color: @bgColor !important;
      i,
      span {
        color: @textColor;
        transition: all 0.5s;
      }
      &:hover {
        i,
        span {
          color: @textColorActive;
        }
      }
    }
  }
}
</style>
