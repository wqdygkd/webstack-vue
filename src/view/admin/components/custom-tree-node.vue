<template>
  <span class="custom-tree-node">
    <template v-if="data.type === 'category'">
      <span>
        <i class="iconfont" :class="data.icon" />
        <span class="category-name" :style="{'background': data.color}">{{ data.name }}</span>
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
      <div class="el-table issues" style="width: 100%;">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
            <tbody>
              <tr class="el-table__row">
                <td rowspan="1" colspan="1">
                  <div class="cell logo">
                    <el-image :src="data.logo" />
                  </div>
                </td>
                <td rowspan="1" colspan="1">
                  <div class="cell">
                    <a :href="data.url">{{ data.name }}</a>
                  </div>
                </td>
                <td rowspan="1" colspan="1">
                  <div class="cell">{{ data.desc }}</div>
                </td>
                <td rowspan="1" colspan="1">
                  <div class="cell">{{ data.index }}</div>
                </td>
                <td rowspan="1" colspan="1">
                  <div class="cell">{{ data.time }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <span>{{ data.name }}</span> -->

      <!-- <span>{{ data.index }}</span> -->
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

  .issues {
    background: transparent;
    .el-table__row {
      &:hover {
        background: #F5F7FA;
      }
    }
    .logo {
      width: 30px;
      height: 30px;
      padding: 5px;
    }
  }
}
</style>
