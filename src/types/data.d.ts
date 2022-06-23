// data.d.ts：用来存放跟数据接口相关类型

// 登录接口返回的数据类型
export type Token = {
  token: string
  refresh_token: string
}

// 定义一个提交表单的类型
export type LoginForm = {
  mobile: string
  code: string
}