// data.d.ts：用来存放跟数据接口相关类型

// axios请求返回数据泛型工具类
type ApiResponse<T> = {
  message: string
  data: T
}

// 登录提交表单的参数类型
export type LoginForm = {
  mobile: string
  code: string
}

// 登录接口返回的数据类型(返回的data里面的数据类型)
export type Token = {
  token: string
  refresh_token: string
}
// 登录接口返回的数据类型
export type LoginResponse = ApiResponse<Token>

// 我的 - 个人信息
export type User = {
  id: string
  name: string
  photo: string
  intro: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}
// 个人信息接口返回的数据类型
export type UserResponse = ApiResponse<User>

// 详细个人资料
export type UserProfile = {
  id: string
  name: string
  photo: string
  mobile: string
  gender: number // 0男 1女
  birthday: string
  intro?: string
}
// 详细个人资料接口返回的数据类型
export type UserProfileResponse = ApiResponse<UserProfile>

// 频道列表数据结构
export type Channel = {
  id: number
  name: string
}
// 频道列表存储结构
export type UserChannel = {
  channels: Array<Channel>
}
// 频道列表接口返回的数据类型
export type UserChannelResponse = ApiResponse<UserChannel>

// 文章列表的数据结构
export type Articles = {
  pre_timestamp: string
  results: {
    art_id: string
    title: string
    aut_id: string
    aut_name: string
    comm_count: number
    pubdate: string
    cover: {
      type: number
      images: string[]
    }
  }[]
}
// 文章列表接口返回的数据类型
export type ArticlesResponse = ApiResponse<Articles>

// 文章详情的数据结构
export type ArticleInfo = {
  art_id: string
  title: string
  pubdate: string
  aut_id: string
  aut_name: string
  aut_photo: string
  is_followed: boolean
  attitude: number // 用户对文章的态度 -1: 无态度，0-不喜欢，1-点赞
  content: number
  is_collected: boolean
}
// 文章详情接口返回的数据类型
export type ArticleInfoResponse = ApiResponse<ArticleInfo>