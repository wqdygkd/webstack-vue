import { customAlphabet } from 'nanoid'

export function toTree (list) {
  const map = {}
  for (const index of list) {
    // index.children = []
    map[index.id] = index
  }

  const _list = []
  for (const index of list) {
    if (map[index.parentId]) {
      if (!map[index.parentId]?.children) {
        map[index.parentId].children = [index]
      } else {
        map[index.parentId].children.push(index)
      }
    } else if (!index.parentId) {
      _list.push(index)
    }
  }
  return _list
}
export function categoryToTree (list) {
  const map = {}

  list = list.map(item => {
    const { name, description, id } = item
    let newName
    const nameArray = name.split(' ')
    const nameArrayLength = nameArray.length
    if (nameArrayLength >= 2) {
      item.parentName = nameArray[nameArrayLength - 2]
      newName = nameArray[nameArrayLength - 1]
    } else {
      newName = name
    }

    const descriptionArray = (description || '').split('|')

    item.icon = descriptionArray[0]
    item.index = descriptionArray[1]
    item.name = newName
    item.type = 'category'

    map[newName] = item
    map[id] = item
    return item
  })
  // 排序
  list.sort((a, b) => {
    return a.index > b.index ? 1 : -1
  })

  const tree = []
  for (const item of list) {
    if (map[item.parentName]) {
      if (!map[item.parentName]?.children) {
        map[item.parentName].children = [item]
      } else {
        map[item.parentName].children.push(item)
      }
    } else if (!item.parentName) {
      tree.push(item)
    }
  }

  return { tree, map }
}

export const nanoid = customAlphabet('1234567890abcdef', 10)
