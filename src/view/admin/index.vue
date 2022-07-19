<template>
  <div>
    <el-tabs v-model="activeName1" @tab-click="handleClick(1)">
      <el-tab-pane v-for="cat1 in category" :key="cat1.id" :label="cat1.name" :name="cat1.id">
        <template v-if="cat1.children && cat1.children.length > 0">
          <el-tabs v-model="activeName2" @tab-click="handleClick(2)">
            <el-tab-pane v-for="cat2 in cat1.children" :key="cat2.id" :label="cat2.name" :name="cat2.id" />
          </el-tabs>
        </template>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="desc" label="简介" />
          <el-table-column prop="url" label="链接" />
          <el-table-column prop="date" label="添加时间" />

          <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
              <el-button type="text" size="small" @click="editHandler(scope)">编辑</el-button>
              <el-button :disabled="scope.$index === 0" type="text" size="small" @click="moveHandler(scope, 1)">上移</el-button>
              <el-button :disabled="scope.$index === tableData.length - 1" type="text" size="small" @click="moveHandler(scope, 2)">下移</el-button>
              <el-button type="text" size="small" @click="deleteHandler(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="type === 'edit' ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="form" label-width="80px">
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
          <el-select v-model="form.region" placeholder="请选择分类">
            <el-option label="分类一" value="category1" />
            <el-option label="分类二" value="category2" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { post, get, patch, put } from '@/api'
import { toTree } from '@/utils'
export default {
  data () {
    return {
      activeName1: '',
      activeName2: '',
      tableData: [],
      category: [],

      type: 'edit',
      dialogVisible: false,
      form: {
        name: '',
        desc: '',
        url: '',
        id: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      await this.getCategory()
      const cat1 = this.category[0] || {}
      const cat2 = cat1.children[0] || {}

      this.activeName1 = cat1.id || '0'
      this.activeName2 = cat2.id || '0'
      this.getWeb()
    },

    async getCategory () {
      const res = await get('/category')
      const category = toTree(res)

      // 排序
      category.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })

      for (let i = 0; i < category.length; i++) {
        const item = category[i]

        // 排序
        item.children.sort((a, b) => {
          return a.index > b.index ? 1 : -1
        })

        if (item.children.length > 0) {
          item.children.unshift({
            children: [],
            id: '0',
            index: '0',
            name: '未分类',
            parentId: item.id
          })
        }
      }

      category.unshift({
        children: [],
        id: '0',
        index: '0',
        name: '未分类'
      })

      this.category = category
    },

    async getWeb () {
      const id = (this.activeName2 === '0' || !this.activeName2) ? this.activeName1 === '0' ? '' : this.activeName1 : this.activeName2
      const res = await get('/web', { categoryId: id })

      // 倒序
      res.sort((a, b) => {
        return a.index > b.index ? -1 : 1
      })
      this.tableData = res
    },

    handleClick (type) {
      if (type === 1) {
        const cat1 = this.category.find(item => item.id === this.activeName1) || {}
        const cat2 = cat1.children[0] || {}
        this.activeName1 = cat1.id
        this.activeName2 = cat2.id
      }

      this.getWeb()
    },

    editHandler ({ row }) {
      this.dialogVisible = true
      this.form = { ...row }
    },
    deleteHandler ({ row }) {

    },
    moveHandler ({ row, $index }, type) {

    },

    async onSubmit () {
      const { form } = this
      if (this.type === 'edit') {
        await patch(`web/${form.id}`, form)
      }
      this.dialogVisible = false
      this.getWeb()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
