export function toTree (list) {
  const map = {}
  for (const index of list) {
    index.children = []
    map[index.id] = index
  }

  const _list = []
  for (const index of list) {
    if (map[index.parentId]) {
      map[index.parentId].children.push(index)
    } else if (!index.parentId) {
      _list.push(index)
    }
  }
  return _list
}
