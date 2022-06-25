import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/types/store'

// RootState => { login: Token; profile: ProfileState; }
// type RootState = ReturnType<typeof store.getState>
// 获取到RootState对象类型中，所有键的集合：keyof RootState => 'login' | 'profile'
// const useInitialState = (action: () => void, stateName: keyof RootState) {}
export const useInitialState = <StateName extends keyof RootState>(
  action: () => void,
  stateName: StateName
) => {
  const dispatch = useDispatch()
  // 下面两种写法都ok
  const state = useSelector((state: RootState) => state[stateName])
  // const state = useSelector<RootState, RootState[StateName]>(
  //   state => state[stateName]
  // )

  useEffect(() => {
    dispatch(action())
  }, [dispatch, action])

  return state
}
