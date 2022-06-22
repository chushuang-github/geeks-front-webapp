import type { RootAction } from "@/types/store"
import type { Token } from "@/types/data"

const initialState: Token = {
  token: '',
  refresh_token: ''
}

// state = initialState，利用了类型推导，state的类型就是Token类型
export const login = (state = initialState, action: RootAction) => {
  switch (action.type) {
    case 'login/token':
      return action.payload
    default:
      return state
  }
}
