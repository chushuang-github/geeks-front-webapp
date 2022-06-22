// store.d.ts：用来存放跟 Redux 相关类型，比如 action 的类型等
import store from '@/store'
import { ThunkAction } from 'redux-thunk'

// redux总的action类型 (所有action类型的集合)
export type RootAction = unknown

// redux总的state的类型，useSelector需要指定状态的类型
export type RootState = ReturnType<typeof store.getState>

// 自定义 thunk action 的类型 (定义异步action的返回类型)
// ThunkAction<void, redux总state, unknown, 所有action类型的集合>
export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>
