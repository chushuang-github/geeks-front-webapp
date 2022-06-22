// utils -> http.ts
// 对axios进行二次封装
import axios from 'axios'
import store from '@/store'
import { Toast } from 'antd-mobile'
import { customHistory } from './history'

const http = axios.create({
  baseURL: 'http://toutiao.itheima.net/v1_0',
  timeout: 5000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    let {
      login: { token },
    } = store.getState() // 获取token

    // 除了登录请求外，其他请求统一添加token，登录是不用携带token的
    if (!config.url?.startsWith('/authorizations')) {
      config.headers!['Authorization'] = `Bearer ${token}` // !：非空断言
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data ? response.data : {}
  },
  (error) => {
    // 响应失败时，会执行此处的回调函数
    if (!error.response) {
      // 网络超时
      Toast.show({
        content: '网络繁忙，请稍后再试',
        duration: 1000,
      })
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      // 状态码401：token失效 or 登录失败 or token不存在
      Toast.show({
        content: '登录超时，请重新登录',
        duration: 1000,
        afterClose: () => {
          // 跳转到登录页面，并且通过state方式携带参数 (当前路径)
          // state方式传参跳转之后，刷新页面参数不会消失
          customHistory.push('/login', {
            from: customHistory.location.pathname,
          })
        },
      })
    }
  }
)

export { http }
