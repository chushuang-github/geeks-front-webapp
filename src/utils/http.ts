// utils -> http.ts
// 对axios进行二次封装
import axios from 'axios'
import store from '@/store'
import { Toast } from 'antd-mobile'
import { setToken, clearToken } from './token'
import { customHistory } from './history'
import type { AxiosError } from 'axios'

const baseURL = 'http://toutiao.itheima.net/v1_0'
const http = axios.create({
  baseURL,
  timeout: 5000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    let { token } = store.getState().login

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
  async (error: AxiosError) => {
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
      try {
        // 状态码401：token失效 or 登录失败 or token不存在
        let { refresh_token } = store.getState().login
        // refresh_token不存在，抛出异常，进入catch
        if (!refresh_token) {
          await Promise.reject(error)
        }

        // 有 refresh_token，就用 refresh_token 换取新的 token
        // 注意：
        //  1 此处需要使用 axios 发请求
        //  2 因为使用的是 axios 所以，此处需要指定完整的 接口路径
        //  3 对于 put 请求来来说，第 3 个参数才表示配置项，才能够设置 请求头
        //  4 此处的请求头用的是 refresh_token 而不是 token
        const res = await axios.put(`${baseURL}/authorizations`, null, {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        })
        // 使用新拿到的token替换本地的token以及 redux 中的token
        const tokens = {
          token: res.data.data.token, // token是最新的
          refresh_token, // refresh_token不变，还是使用之前的
        }
        setToken(tokens)
        store.dispatch({ type: 'login/token', payload: tokens })

        // 继续完成原来要执行的操作
        // 比如，在获取个人资料时，token过期了，最终，在换取新的token后，继续获取个人资料
        // 可以通过 error.config 来拿到原来发送的请求的相关信息
        // 所以，要执行原来的操作，只需要将 error.config 重新请求一次即可
        // 注意：此处，一定要返回 Promise 的结果
        // 出错 -> error -> 401 -> 换取新的token -> 重新发送之前的请求 -> 正确
        return http(error.config)
      } catch {
        // 如果换取新 token 的过程中，代码出错了，一般就说明 refresh_token 失效了
        // 此时，就清空token然后返回登录页面
        // 注意：在直接分发 thunk action 时，会报类型错误
        // store.dispatch(logout())  // 报错
        // 解决方式：先自己手动分发对象形式的 action 来实现退出
        clearToken()
        store.dispatch({ type: 'login/logout' })
        Toast.show({
          content: '登录超时，请重新登录',
          duration: 1000,
          afterClose: () => {
            customHistory.push('/login', {
              from: customHistory.location.pathname,
            })
          },
        })
      }
    }
    return Promise.reject(error)
  }
)

export { http }
