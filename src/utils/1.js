// 8 P ! " # &
const a = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz|}~'
const b = [...a]
const length_ = b.length

const min = '0'
const max = '~'
const array = []

function create (max, min) {
  max = array[array.length - 1]
  if (!max) {
    const t = b[length_ - 10]
    array.push(t)
    return t
  }
  if (!min) {
    // 创建
    const last = max.slice(-1)
    const index = a.indexOf(last)
    console.log('index', index)
    let t
    if (index < 10) {
      t = b[length_ + index - 10]
      t = ' ' + max.slice(0, -1) + t
    } else {
      t = b[index - 10]
      t = max.slice(0, -1) + t
    }

    array.push(t)
    return t
  } else {
    // 移动
    if (min.length === max.length) {
      const maxlast = max.slice(-1)
      const maxlastindex = a.indexOf(maxlast)
      const minlast = min.slice(-1)
      const minlastindex = a.indexOf(minlast)
      if (maxlastindex - minlastindex > 1) {}
    }
  }
}
