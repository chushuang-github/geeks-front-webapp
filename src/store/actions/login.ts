// 专门处理登录action的文件
import { http } from "@/utils/http"
import { setToken } from "@/utils/token"
import type { RootThunkAction } from "@/types/store"
import type { LoginForm, LoginResponse } from "@/types/data"

// 登录请求
export const login = (loginParams: LoginForm): RootThunkAction => {
  return async dispatch => {
    // 使用泛型进行指定返回值类型，因为我们axios响应拦截器已经结构了一层data数据了
    // 这里使用泛型指定返回值类型的话，类型会多一层data，所有我们使用下面的类型断言进行指定
    // 如果axios响应拦截器没有解构一层data的话，这里就使用下面的泛型指定请求数据返回值类型就ok了
    // http.post<LoginResponse>('/authorizations', loginParams)
    // 使用类型断言，指定请求回来的数据类型
    const res = await http.post('/authorizations', loginParams) as LoginResponse
    // 将token进行本地存储
    setToken(res.data)
    // redux存储token
    dispatch({
      type: 'login/token',
      payload: res.data
    })
  }
}

// 短信验证码请求
export const sendCode = (mobile: string): RootThunkAction => {
  return () => {
    return http.get(`/sms/codes/${mobile}`)
  }
}