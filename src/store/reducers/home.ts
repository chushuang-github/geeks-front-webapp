import type { Channel, Articles } from '@/types/data'
import type { HomeAction } from '@/types/store'

type HomeState = {
  userChannels: Channel[]
  channelArticles: {
    [key in number]: Articles
  }
}
const initialState: HomeState = {
  userChannels: [],
  channelArticles: {},
}

export const home = (state = initialState, action: HomeAction): HomeState => {
  switch (action.type) {
    case 'home/getuserchannel':
      return { ...state, userChannels: action.payload }
    case 'home/getchannelarticles':
      // 结构传递过来的参数
      const {
        channel_id,
        data: { pre_timestamp, results },
        actionType,
      } = action.payload
      // 读取原来的数据
      const preArticles = state.channelArticles[channel_id]
        ? state.channelArticles[channel_id].results
        : []
      return {
        ...state,
        channelArticles: {
          ...state.channelArticles,
          [channel_id]: {
            pre_timestamp,
            results:
              actionType === 'append'
                ? [...preArticles, ...results]
                : [...results],
          },
        },
      }
    default:
      return state
  }
}
