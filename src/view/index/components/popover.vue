<template>
  <el-popover
    placement="bottom-start"
    width="70"
    class="operate"
    popper-class="operate-popper"
    trigger="hover"
  >
    <li v-if="$listeners.del" class="el-dropdown-menu__item" @click="delCategory">删除</li>
    <li class="el-dropdown-menu__item" @click="editCategory">编辑</li>
    <li v-if="index !== 0" class="el-dropdown-menu__item" @click="moveCategory(1)">上移</li>
    <li v-if="index !== menu.length - 1" class="el-dropdown-menu__item" @click="moveCategory(2)">下移</li>
    <i slot="reference" class="fa fa-ellipsis-h" />
  </el-popover>
</template>

<script>
export default {
  name: 'Popover',
  props: {
    index: {
      type: Number,
      default: 0
    },
    menu: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    delCategory () {
      this.$emit('del')
    },
    editCategory () {
      this.$emit('edit')
    },
    moveCategory (type) {
      this.$emit('move', type)
    }
  }
}
</script>

<style scoped lang="less">

</style>
