<template>
  <span class="custom-tree-node">
    <template v-if="data.type === 'category'">
      <span>
        <i class="iconfont" :class="data.icon" />
        <span class="category-name" :style="{'background': `#${data.color}`}">{{ data.name }}</span>
      </span>
      <span>{{ data.index }}</span>
      <span>
        <el-button type="text" size="mini" @click="() => add(data)">
          新增
        </el-button>
        <el-button type="text" size="mini" @click="() => change(data)">
          修改
        </el-button>
        <el-button
          :disabled="data.children && data.children.length > 0"
          type="text"
          size="mini"
          @click="() => remove(node, data)"
        >
          删除
        </el-button>
      </span>
    </template>
    <template v-else>
      <span>{{ data.name }}</span>
      <span>
        <el-button
          type="text"
          size="mini"
          @click="() => change(data)"
        >
          修改
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="() => remove(node, data)"
        >
          删除
        </el-button>
      </span>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    node: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    remove (node, data) {
      console.log(node, data)
    },

    change (data) {
      this.$emit('change', data)
    }
  }
}
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .category-name {
    padding: 0 10px;
    border-radius: 10px;
    color: #fff;
  }
}
</style>
