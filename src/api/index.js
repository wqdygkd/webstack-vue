import axios from 'axios'

export const instance = axios.create({
  timeout: 120_000,
  baseURL: 'http://localhost:8080/api'
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    // 上传
    config.headers['Content-Type'] = config.url.includes('/upload') ? 'application/x-www-form-urlencoded' : 'application/json'

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
export function get (url, parameters = {}, responseType) {
  return new Promise((resolve, reject) => {
    let urlParameters = []
    for (const key of Object.keys(parameters)) {
      urlParameters.push(`${key}=${encodeURIComponent(parameters[key])}`)
    }
    urlParameters = urlParameters.length > 0 ? `${url}?${urlParameters.join('&')}` : url
    instance({
      url: urlParameters,
      params: {
        randomTime: Date.now() // 防止缓存
      },
      responseType
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 封装post请求
export function post (url, data = {}, responseType, properties) {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      responseType,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...properties
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
