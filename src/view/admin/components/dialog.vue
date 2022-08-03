<template>
  <div>
    <el-dialog
      :title="type === 'edit' ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
    >
      <el-form v-if="type === 'addIssues' || type === 'changeIssues'" ref="form" :model="form" label-width="80px">
        <el-form-item label="logo">
          <Upload v-model="form.logo" />
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
        <!-- <el-form-item label="分类">
          <el-cascader
            v-model="form.categoryId"
            :options="category"
            :props="{ value: 'id', label: 'name'}"
            placeholder="请选择分类"
          />
        </el-form-item> -->
      </el-form>

      <template v-if="form.type === 'category'">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.newName" />
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.newIcon" />
          </el-form-item>
          <el-form-item label="背景">
            <el-color-picker v-model="form.newColor" />
          </el-form-item>
        </el-form>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from './upload.vue'
export default {
  components: {
    Upload
  },

  data () {
    return {
      dialogVisible: false,
      type: '', // addIssues
      form: {},
      parent: undefined
    }
  },

  methods: {
    open (type, form, parent) {
      this.type = type
      this.form = { ...form }
      this.parent = parent
      this.dialogVisible = true
    },

    close () {
      this.dialogVisible = false
    },

    submitHandler () {
      this.$emit('submit', this.form, this.type, this.parent)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
