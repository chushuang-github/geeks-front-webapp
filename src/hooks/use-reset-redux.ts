// 退出文章详情页面，清空redux数据
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { RootState } from '@/types/store'

export const useResetRedux = <StateName extends keyof RootState>(
  stateName: StateName
) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // 页面卸载的时候调用返回的回调函数
    return () => {
      dispatch({
        type: 'reset',
        payload: stateName,
      })
    }
  }, [dispatch, stateName])
}
