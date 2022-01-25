export function toTree(list) {
    const map = {}
    list.forEach(i => {
        map[i.id] = i
    })

    const _list = []
    list.forEach(i => {
        if(map[i.parentId]) {
            if(!map[i.parentId]?.children) {
                map[i.parentId].children = [i]
            }else {
                map[i.parentId].children.push(i)
            }
        }else if(!i.parentId){
            _list.push(i)
        }
    })
    return _list
}

