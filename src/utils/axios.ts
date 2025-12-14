import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加token
    // config.headers['Authorization'] = getToken()
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 根据实际项目中的响应格式进行处理
    if (res.code !== 200) {
      // 例如：处理错误码
      console.error('响应错误:', res.msg || 'Error')
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  (error) => {
    console.error('响应错误:', error)
    return Promise.reject(error)
  }
)

export default service