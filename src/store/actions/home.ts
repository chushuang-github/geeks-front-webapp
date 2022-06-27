import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type {
  UserChannelResponse,
  Channel,
  ArticlesResponse,
} from '@/types/data'

// 创建一个本地存储频道的key
const Channel_Key = 'geek-channels'

// 获取用户频道列表
export const getUserChannel = (): RootThunkAction => {
  // thunk action 返回的函数，第二个参数getState可以获取redux状态
  return async (dispatch, getState) => {
    let userChannels: Channel[] = []
    // 判断当前用户是否登录 - 判断当前有没有token
    const { token } = getState().login
    if (token) {
      // token存在 - 登录
      const res = (await http.get('/user/channels')) as UserChannelResponse
      userChannels = res.data.channels
    } else {
      // token不存在 - 未登录
      const localChannels = JSON.parse(
        localStorage.getItem(Channel_Key) ?? '[]'
      ) as Channel[]
      if (localChannels.length > 0) {
        // 本地缓存有数据
        userChannels = localChannels
      } else {
        // 没有本地缓存 -> 发送请求 -> 获取数据存储到缓存中
        const res = (await http.get('/user/channels')) as UserChannelResponse
        localStorage.setItem(Channel_Key, JSON.stringify(res.data.channels))
        userChannels = res.data.channels
      }
    }
    dispatch({
      type: 'home/getuserchannel',
      payload: userChannels,
    })
  }
}

// 获取用户文章列表
export const getArticleList = (
  channel_id: number,
  timestamp: string,
  actionType: 'append' | 'replace'
): RootThunkAction => {
  return async (dispatch) => {
    const res = (await http.get('/articles', {
      params: { channel_id, timestamp },
    })) as ArticlesResponse
    dispatch({
      type: 'home/getchannelarticles',
      payload: { channel_id, data: res.data, actionType },
    })
  }
}
