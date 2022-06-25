import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type { UserResponse, UserProfileResponse } from '@/types/data'

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
