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

export const nanoid = customAlphabet('1234567890abcdef', 10)
