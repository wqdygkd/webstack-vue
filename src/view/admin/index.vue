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
        <CustomTreeNode :data="data" :node="node" @change="changeHandler" @remove="removeHandler" />
      </template>
    </el-tree>

    <el-button @click="login">登录</el-button>
    <el-button @click="addHandler('addIssues')">新增</el-button>

    <Dialog ref="dialog" @submit="submitHandler" />
  </div>
</template>

<script>
import octokit from '@/api/octokit.js'
import { labelsToTree } from '@/utils'
import oauthProvider from '@/utils/config'
import CustomTreeNode from './components/custom-tree-node'
import Dialog from './components/dialog.vue'

import fractionalIndex from 'fractional-index'

export default {
  components: {
    CustomTreeNode,
    Dialog
  },
  data () {
    return {
      category: [],
      map: {},

      loadingInstance: undefined
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.loadingInstance = this.$loading({ lock: true, spinner: 'el-icon-loading' })
      const labels = await this.getLabels()
      const issues = await this.getIssues()

      const { tree: labelsTree, map } = labelsToTree(labels)

      issues.forEach(item => {
        const id = item.categoryId
        if (map[id]) {
          if (!map[id].children) {
            this.$set(map[id], 'children', [item])
          } else {
            map[id].children.push(item)
          }
        } else {
          labelsTree.push(item)
        }
      })

      this.category = labelsTree
      this.map = map

      this.loadingInstance && this.loadingInstance.close()
    },

    async getLabels () {
      try {
        const res = await octokit.request('GET /repos/{owner}/{repo}/labels', {
          owner: 'wqdygkd',
          repo: 'webstack-vue'
        })
        return res.data || []
      } catch (error) {
        console.log(error.message)
        if (error.message === 'Bad credentials') {
          this.$alert('登录过期', '', {
            confirmButtonText: '重新登录',
            callback: action => {
              this.login()
            }
          })
        }
      }
    },

    async getIssues () {
      const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: 'wqdygkd',
        repo: 'webstack-vue'
      })

      const data = (res.data || []).filter(item => item.author_association === 'OWNER').map(item => {
        const { body, title: name, labels, id, created_at: time, number, reactions } = item

        const bodyMap = new Map(body.split('\n').map(item => {
          const match = item.match(/([^:]*):(.*)/)
          if (!match || !match[1] || !match[2]) return false
          return [match[1].trim(), match[2].trim()]
        }).filter(Boolean))

        return {
          name,
          body,
          id,
          categoryId: labels[0] && labels[0].id,
          categoryName: labels[0] && labels[0].name,
          url: bodyMap.get('链接'),
          logo: bodyMap.get('图标'),
          desc: bodyMap.get('说明'),
          index: bodyMap.get('排序'),
          time,
          number
        }
      })

      // index正序 + 时间倒序
      return data.sort((a, b) => {
        const indexA = a.index
        const indexB = b.index
        const timeA = a.time
        const timeB = b.time

        if (indexA && indexB) return indexA > indexB ? 1 : -1
        if (!indexA && !indexB) return timeA > timeB ? -1 : 1
        if (indexA) return -1
        return 1
      })
    },

    addHandler (type, parent) {
      this.$refs.dialog.open(type, {}, parent)
    },

    changeHandler (node) {
      const { data, parent } = node
      const type = data.type === 'category' ? 'changeLabels' : 'changeIssues'

      const form = {
        ...data,
        newName: data.name,
        newIcon: data.icon,
        newColor: data.color
      }
      this.$refs.dialog.open(type, form, parent)
    },

    async submitHandler (form, type, parent) {
      this.loadingInstance = this.$loading({
        lock: true,
        spinner: 'el-icon-loading'
      })

      if (type === 'addIssues') {
        await this.addIssuesConfirm(form, parent)
      } else if (type === 'changeIssues') {
        await this.changeIssuesConfirm(form, parent)
      } else {
        try {
          await this.onSubmit(form)

          this.init()
        } catch (error) {
          console.log(error)
        }
      }

      this.loadingInstance && this.loadingInstance.close()
    },

    async addIssuesConfirm (form, parent) {
      console.log(form)
      const { name, url, logo, desc } = form
      parent = parent || { children: this.category }
      const children = parent.children || []
      const first = children.filter(item => item.type !== 'category')[0] || {}

      const A = null
      const B = first.index || 'Q'
      const index = fractionalIndex(A, B)

      const label = `${parent.parentName ? parent.parentName + ' ' : ''}${parent.name || ''}`
      const body = `链接: ${url}\r\n图标: ${logo}\r\n说明: ${desc}\r\n排序: ${index}`

      console.log(name, body, label)
      await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner: 'wqdygkd',
        repo: 'webstack-vue',
        title: name,
        body,
        labels: label ? [label] : undefined
      })

      this.$refs.dialog.close()
    },

    async changeIssuesConfirm (form, parent) {
      const { name, url, logo, desc, index, number } = form
      parent = parent || { children: this.category }
      const body = `链接: ${url}\r\n图标: ${logo}\r\n说明: ${desc}\r\n排序: ${index}`
      const label = `${parent.parentName ? parent.parentName + ' ' : ''}${parent.name || ''}`

      await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: 'wqdygkd',
        repo: 'webstack-vue',
        issue_number: number,
        title: name,
        body,
        labels: label ? [label] : undefined
      })

      this.$refs.dialog.close()
    },

    async removeHandler (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(row)
        if (row.type === 'categry') {

        } else {

        }
        // await del(`web/${row.id}`)
        // this.getWeb()
      }).catch(() => {})
    },

    async onSubmit (form, parent) {
      if (form.type === 'category') {
        const name = form.parentName ? `${form.parentName} ${form.name}` : form.name
        const newName = parent ? `${parent.newName} ${form.newName || form.name}` : form.newName
        const newColor = parent ? parent.newColor : form.newColor
        const description = form.description
        const newDescription = `${form.newIcon === undefined ? (form.icon || '') : (form.newIcon || '')}|${form.index || ''}`

        // console.log(name, newName)
        // console.log(description, newDescription)
        // console.log(newColor)

        if (name === newName && description === newDescription && `#${form.color}` === newColor) {
          console.log('无变化')
        } else {
          await octokit.request('PATCH /repos/{owner}/{repo}/labels/{name}', {
            owner: 'wqdygkd',
            repo: 'webstack-vue',
            name: name,
            new_name: newName,
            description: newDescription,
            color: newColor.slice(1)
          })
        }

        if (form.children) {
          await form.children.reduce(async (previousValue, currentValue) => {
            await previousValue
            await this.onSubmit(currentValue, { ...form, newName, newColor })
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
      let parent = dropNode.parent && dropNode.parent.data
      const drop = dropNode.data
      const dragging = draggingNode.data

      if (Array.isArray(parent)) {
        parent = { children: this.category }
      }

      parent.children = parent.children || []
      const dropPosition = parent.children.findIndex(item => item.id === drop.id)
      console.log(dropPosition)
      let A
      let B
      if (dropType === 'before') {
        if (dropPosition <= 1) {
          A = null
          B = drop.index || 'Q'
        } else {
          A = parent.children[dropPosition - 2].index || null
          B = drop.index || 'Q'
        }
      } else if (dropType === 'after') {
        if (dropPosition === parent.children.length - 2) {
          A = drop.index || 'Q'
          B = null
        } else {
          A = drop.index || 'Q'
          B = parent.children[dropPosition + 2].index || null
        }
      } else if (dropType === 'inner') {
        parent = drop
        const leng = drop.children.length
        A = leng - 2 === -1 ? 'Q' : drop.children[leng - 2].index
        B = null
      }

      console.log(A, B)
      const index = fractionalIndex(A, B)
      const name = dragging.name
      const icon = dragging.icon

      const newName = parent.name ? parent.name + ' ' + dragging.name : dragging.name
      const description = `${icon}|${index}`

      console.log(name, newName, description)

      this.submitHandler({
        ...dragging,
        newName,
        index,
        icon
      })
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
