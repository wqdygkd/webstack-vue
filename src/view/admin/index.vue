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
        <CustomTreeNode :data="data" :node="node" @change="change" />
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

      <template v-if="formData.data.type === 'category'">
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="formData.icon" />
          </el-form-item>
        </el-form>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { post, get, patch, del } from '@/api'
import octokit from '@/api/octokit.js'
import { toTree, nanoid, categoryToTree } from '@/utils'

import CustomTreeNode from './components/custom-tree-node'
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
      formData: {
        data: {},

        name: '',
        icon: '',

        desc: '',
        url: '',
        id: ''
      },

      editDate: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      await this.getCategory()
      // const cat1 = this.category[0] || {}
      // const cat2 = (cat1.children && cat1.children[0]) || {}

      // this.activeName1 = cat1.id || '0'
      // this.activeName2 = cat2.id || '0'
      // this.getWeb()
    },

    async getCategory () {
      const res = await get('/category')
      const { tree: category, map } = categoryToTree(res)

      // for (let i = 0; i < category.length; i++) {
      //   const item = category[i]
      //   if (item.children) {
      //     if (item.children.length > 0) {
      //       item.children.unshift({
      //         // children: [],
      //         id: '0',
      //         index: '0',
      //         name: '未分类',
      //         parentId: item.id
      //       })
      //     }
      //   }
      // }

      // category.unshift({
      //   // children: [],
      //   id: '0',
      //   index: '0',
      //   name: '未分类'
      // })

      // this.category = category
      this.getWebNew(map, category)
      // web = JSON.parse(JSON.stringify(web))
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

    handleClick (type) {
      if (type === 1) {
        const cat1 = this.category.find(item => item.id === this.activeName1) || {}
        const cat2 = (cat1.children && cat1.children[0]) || {}
        this.activeName1 = cat1.id
        this.activeName2 = cat2.id
      }

      this.getWeb()
    },

    editHandler ({ row }) {
      this.type = 'edit'
      this.dialogVisible = true
      const categoryId = [this.activeName1]
      if ((this.activeName1 === '0' && this.activeName2 !== '0') || (this.activeName1 !== '0' && this.activeName2)) {
        categoryId.push(this.activeName2)
      }
      this.form = { ...row, categoryId }
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

    async onSubmit () {
      const { formData } = this
      if (formData.data.type === 'category') {
        await octokit.request('PATCH /repos/{owner}/{repo}/labels/{name}', {
          owner: 'wqdygkd',
          repo: 'webstack-vue',
          // name: formData.data.name,
          // new_name: formData.name,
          name: 'test',
          new_name: 'test',
          description: 'formData.icon|0'
          // color: 'b01f26'
        })
      }

      console.log(formData)
      // const category = this.form.categoryId
      // const categoryId = !category[1] || category[1] === '0' ? category[0] : category[1]
      // if (this.type === 'edit') {
      //   await patch(`web/${form.id}`, { ...form, categoryId })
      // } else if (this.type === 'add') {
      //   await post('web', { ...form, categoryId, time: +new Date(), id: nanoid() })
      // }
      // this.dialogVisible = false
      // this.getWeb()
    },

    login () {
      window.open('https://github.com/login/oauth/authorize?client_id=Iv1.d09f858f30eada25&redirect_uri=https://localhost:8087/oauth/callback')
    },

    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.name)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.name)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.name)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.name, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.name, dropType)
    },

    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.id === '0' || (dropNode.level === 2 && type === 'inner')) {
        return false
      } else {
        return true
      }
    },

    allowDrag (draggingNode) {
      console.log(draggingNode)
      return draggingNode.data.id !== '0'
    },

    change (data) {
      this.type = 'edit'
      this.dialogVisible = true

      this.formData.data = data
      this.formData.name = data.name
      this.formData.icon = data.icon

      console.log(data)
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
