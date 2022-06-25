import type { UserAction } from '@/types/store'
import type { User, UserProfile } from '@/types/data'

type UserState = {
  user: User
  profile: UserProfile
}
const initialState: UserState = {
  user: {},
  profile: {}
} as UserState // 类型断言是一种主观上面的判断，会屏蔽ts的错误提示

export const profile = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case 'user/getuser':
      return { ...state, user: action.payload }
    case 'user/getprofile':
      return { ...state, profile: action.payload }
    default:
      return state
  }
}
