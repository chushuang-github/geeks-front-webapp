import { getToken } from '@/utils/token'
import type { LoginAction } from '@/types/store'
import type { Token } from '@/types/data'

// getToken函数调用结果 -> { token: "值", refresh_token: "值" }
const initialState: Token = getToken()

// state = initialState，利用了类型推导，state的类型就是Token类型
export const login = (state = initialState, action: LoginAction): Token => {
  switch (action.type) {
    case 'login/token':
      return action.payload
    default:
      return state
  }
}
