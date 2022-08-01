<template>
  <div>
    <el-tree
      :data="category"
      node-key="id"
      :default-expand-all="false"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :props="{ label: 'name'}"
      :expand-on-click-node="false"
      @node-drop="handleDrop"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
    >
      <template #default="{ node, data }">
        <CustomTreeNode :data="data" :node="node" @change="changeHandler" />
      </template>
    </el-tree>

    <el-button @click="login">登录</el-button>

    <el-dialog
      :title="type === 'edit' ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
    >
      <el-form v-if="false" ref="form" :model="form" label-width="80px">
        <el-form-item label="logo">
          <el-upload
            class="upload-demo"
            drag
            action=""
            :http-request="handleUpload"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            v-model="form.categoryId"
            :options="category"
            :props="{ value: 'id', label: 'name'}"
            placeholder="请选择分类"
          />
        </el-form-item>
      </el-form>

      <template v-if="form.type === 'category'">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.newName" />
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.newIcon" />
          </el-form-item>
        </el-form>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler(form)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { post, get, patch, del } from '@/api'
import octokit from '@/api/octokit.js'
import { toTree, nanoid, categoryToTree } from '@/utils'
import oauthProvider from '@/utils/config'
import CustomTreeNode from './components/custom-tree-node'

import fractionalIndex from 'fractional-index'

export default {
  components: {
    CustomTreeNode
  },
  data () {
    return {
      activeName1: '',
      activeName2: '',
      tableData: [],
      category: [],
      map: {},

      type: 'edit',
      dialogVisible: false,
      form: {
        name: '',
        icon: '',

        desc: '',
        url: '',
        id: ''
      },

      loadingInstance: undefined
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.loadingInstance = this.$loading({ lock: true, spinner: 'el-icon-loading' })
      await this.getCategory()
      this.loadingInstance && this.loadingInstance.close()
    },

    async getCategory () {
      const res = await octokit.request('GET /repos/{owner}/{repo}/labels', {
        owner: 'wqdygkd',
        repo: 'webstack-vue'
      })

      const data = res.data || []
      const { tree: category, map } = categoryToTree(data)

      this.getWebNew(map, category)
    },

    async getWebNew (map, category) {
      const res = await get('/web')
      // index正序 + 时间倒序
      res.sort((a, b) => {
        const indexA = a.index
        const indexB = b.index
        const timeA = a.time
        const timeB = b.time

        if (indexA && indexB) return indexA > indexB ? 1 : -1
        if (!indexA && !indexB) return timeA > timeB ? -1 : 1
        if (indexA) return -1
        return 1
      })
      res.forEach(item => {
        const id = item.categoryId
        if (map[id]) {
          if (!map[id].children) {
            // map[id].web = [item]

            this.$set(map[id], 'children', [item])
          } else {
            map[id].children.push(item)
          }
        } else {
          category.push(item)
        }
      })

      this.category = category
      this.map = map
    },

    async getWeb () {
      const id = (this.activeName2 === '0' || !this.activeName2) ? this.activeName1 === '0' ? '' : this.activeName1 : this.activeName2
      const res = await get('/web', { categoryId: id })

      // index正序 + 时间倒序
      res.sort((a, b) => {
        const indexA = a.index
        const indexB = b.index
        const timeA = a.time
        const timeB = b.time

        if (indexA && indexB) return indexA > indexB ? 1 : -1
        if (!indexA && !indexB) return timeA > timeB ? -1 : 1
        if (indexA) return -1
        return 1
      })
      this.tableData = res
    },

    async  deleteHandler ({ row }) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await del(`web/${row.id}`)
        this.getWeb()
      }).catch(() => {})
    },
    moveHandler ({ row, $index }, type) {

    },

    addWeb () {
      this.type = 'add'
      this.form = {}
      this.dialogVisible = true
    },

    changeHandler (data) {
      this.type = 'edit'
      this.dialogVisible = true

      this.form = {
        ...data,
        newName: data.name,
        newIcon: data.icon
      }
    },

    async submitHandler (form) {
      this.loadingInstance = this.$loading({
        lock: true,
        spinner: 'el-icon-loading'
      })

      try {
        await this.onSubmit(form)
        this.dialogVisible = false
        this.init()
      } catch (error) {
        console.log(error)
      }

      this.loadingInstance && this.loadingInstance.close()
    },

    async onSubmit (form, parent) {
      if (form.type === 'category') {
        const name = form.parentName ? `${form.parentName} ${form.name}` : form.name
        const newName = parent ? `${parent.newName} ${form.newName || form.name}` : form.newName

        const description = form.description
        const newDescription = `${form.newIcon === undefined ? (form.icon || '') : (form.newIcon || '')}|${form.index || ''}`

        console.log(name, newName)
        console.log(description, newDescription)

        if (name === newName && description === newDescription) {
          console.log('无变化')
        } else {
          await octokit.request('PATCH /repos/{owner}/{repo}/labels/{name}', {
            owner: 'wqdygkd',
            repo: 'webstack-vue',
            name: name,
            new_name: newName,
            description: newDescription
          // color: 'b01f26'
          })
        }

        if (form.children) {
          await form.children.reduce(async (previousValue, currentValue) => {
            await previousValue
            await this.onSubmit(currentValue, { ...form, newName })
          }, [])
        }
      }
    },

    login () {
      localStorage.setItem('redirect', 'Admin')
      const { oauth_uri: oauthUri, client_id: clientId, redirect_uri: redirectUri } = oauthProvider.github
      location.href = `${oauthUri}?client_id=${clientId}&redirect_uri=${redirectUri}`
    },

    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.data.name)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.data.name)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.data.name)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.data.name, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', draggingNode, dropNode, dropType, ev)
      const parent = (dropNode.parent && dropNode.parent.data) || { children: this.category }
      const drop = dropNode.data
      const dragging = draggingNode.data

      const dropPosition = parent.findIndex(item => item.id === drop.id)

      let A
      let B
      if (dropType === 'before') {
        if (dropPosition === 0) {
          A = null
          B = drop.index || ' '
        } else {
          A = parent[dropPosition - 1].index || ' '
          B = drop.index || ' '
        }
      } else if (dropType === 'after') {
        if (dropPosition === parent.length - 1) {
          A = drop.index || 'Q'
          B = null
        } else {
          A = drop.index || null
          B = parent[dropPosition + 1].index || ' '
        }
      }
      console.log(A, B)
      const index = fractionalIndex(A, B)
      const name = dragging.name
      const icon = dragging.icon

      const newName = parent.name ? parent.name + ' ' + dragging.name : dragging.name
      const description = `${icon}|${index}`

      console.log(name, newName, description)
    },

    allowDrop (draggingNode, dropNode, type) {
      console.log('allowDrop', draggingNode, dropNode, type)
      const draggingData = draggingNode.data
      const dropData = dropNode.data

      // 拖拽含有子分类
      if ((draggingData.children || []).some(item => item.type === 'category')) {
        if (type === 'inner') {
          return false
        } else {
          return true
        }
      } else {
        if ((dropNode.level === 2 && type === 'inner')) {
          return false
        }
        return true
      }
    },

    allowDrag (draggingNode) {
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 40px;
  height: 40px;
}
/deep/.el-tree-node__content {
  height: 30px;
}
</style>
