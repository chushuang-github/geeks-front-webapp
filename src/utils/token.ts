// utils -> token.ts
// 解决token同步存储的问题：localStorage
import type { Token } from '@/types/data'
const TOKEN_KEY = 'itcast_geek_mobile'

// 获取token
// localStorage.getItem(TOKEN_KEY)有可能为null，但是getToken的返回值类型是Token类型的
const getToken = (): Token => {
  return JSON.parse(
    localStorage.getItem(TOKEN_KEY) || '{"token":"","refresh_token":""}'
  )
}
// 存储token
const setToken = (token: Token) => {
  return localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

// 清除token
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export { getToken, setToken, clearToken }
