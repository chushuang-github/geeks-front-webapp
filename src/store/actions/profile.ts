import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type {
  UserResponse,
  UserProfileResponse,
  UserProfile,
} from '@/types/data'

// 获取个人信息
export const getUser = (): RootThunkAction => {
  return async (dispatch) => {
    const res = (await http.get('/user')) as UserResponse
    dispatch({
      type: 'user/getuser',
      payload: res.data,
    })
  }
}

// 获取详细个人资料
export const getUserProfile = (): RootThunkAction => {
  return async (dispatch) => {
    const res = (await http.get('/user/profile')) as UserProfileResponse
    dispatch({
      type: 'user/getprofile',
      payload: res.data,
    })
  }
}

// Partial 可以将 UserProfile 类型里面的所有属性，都变成可选属性 (笔记里面有讲Partial泛型工具类)
type CustomUser = Partial<UserProfile>
// 编辑用户信息
export const updateUserProfile = (userProfile: CustomUser): RootThunkAction => {
  return async (dispatch) => {
    await http.patch('/user/profile', userProfile)
    // 修改昵称成功，分发一个action去修改昵称
    dispatch({
      type: 'user/update',
      payload: userProfile,
    })
  }
}
