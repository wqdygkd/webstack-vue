import axios from 'axios'

export const instance = axios.create({
  timeout: 120000,
  baseURL: 'http://localhost:8080/api'
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    // 上传
    if ( config.url.indexOf('/upload') > -1 ) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
        config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
instance.interceptors.response.use(
  response => {
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      const data = response.data
      if (data.code === 0) {
        return data
      }

      return Promise.reject(data || 'error')
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// get请求
export function get (url, params = {}, responseType) {
  return new Promise((resolve, reject) => {
    let urlParams = []
    Object.keys(params).forEach(key => {
      urlParams.push(`${key}=${encodeURIComponent(params[key])}`)
    })
    if (urlParams.length) {
      urlParams = `${url}?${urlParams.join('&')}`
    } else {
      urlParams = url
    }
    instance({
      url: urlParams,
      params: {
        randomTime: new Date().getTime() // 防止缓存
      },
      responseType
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 封装post请求
export function post (url, data = {}, responseType, props) {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      responseType,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...props
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}
