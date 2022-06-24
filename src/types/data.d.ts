// data.d.ts：用来存放跟数据接口相关类型

// 登录接口返回的数据类型(返回token的数据类型)
export type Token = {
  token: string
  refresh_token: string
}

// 定义一个登录提交表单的参数类型
export type LoginForm = {
  mobile: string
  code: string
}

// 定义一个登录接口返回的数据类型
export type LoginResponse = {
  message: string
  data: Token
}
