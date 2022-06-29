// store.d.ts：用来存放跟 Redux 相关类型，比如 action 的类型等
import store from '@/store'
import { ThunkAction } from 'redux-thunk'
import type {
  Token,
  User,
  UserProfile,
  Channel,
  Articles,
  ArticleInfo,
  ArticleComment,
  ArtComment,
} from './data'

// redux总的action类型 (所有action类型的集合 - 联合类型)
export type RootAction =
  | LoginAction
  | UserAction
  | HomeAction
  | ArticleAction
  | ResetAction

// redux总的state的类型，useSelector需要指定状态的类型
export type RootState = ReturnType<typeof store.getState>

// 自定义 thunk action 的类型 (定义异步action的返回类型)
// ThunkAction<void, redux总state, unknown, 所有action类型的集合>
export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>

// 定义登录的action
export type LoginAction =
  | {
      type: 'login/token' // 字母量类型，固定的值
      payload: Token
    }
  | {
      type: 'login/logout'
    }

// 定义获取个人信息的action
export type UserAction =
  | {
      type: 'user/getuser'
      payload: User
    }
  | {
      type: 'user/getprofile'
      payload: UserProfile
    }
  | {
      type: 'user/update'
      payload: Partial<UserProfile>
    }

// 主页action
export type HomeAction =
  | {
      type: 'home/getuserchannel'
      payload: Channel[]
    }
  | {
      type: 'home/getchannelarticles'
      payload: {
        channel_id: number
        data: Articles
        actionType: 'append' | 'replace'
      }
    }

// 文章详情action
export type ArticleAction =
  | {
      type: 'article/get'
      payload: ArticleInfo
    }
  | {
      type: 'article/getarticlecomments'
      payload: ArticleComment & { actionType: 'replace' | 'append' }
    }
  | {
      type: 'article/addarticlecomment'
      payload: ArtComment
    }

// 清空指定的reducer函数 redux state数据
export type ResetAction = {
  type: 'reset'
  payload: keyof RootState
}
