// 检查用户登录状态
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Dialog } from 'antd-mobile'
import type { RootState } from '@/types/store'

export const useAuthSet = () => {
  const history = useHistory<{ from: string }>()
  const location = useLocation()
  const token = useSelector((state: RootState) => state.login.token)

  // 进行token的判断
  const start = () => {
    if (!token) {
      // 提示用户，要么放弃，要么去登录
      const handler = Dialog.show({
        title: '温馨提示',
        content: '亲，检测到您未登录，如需继续操作，需要去进行登录注册！',
        closeOnMaskClick: true,
        actions: [
          [
            {
              key: 'cancel',
              text: '去登录',
              onClick: () => {
                history.push('/login', {
                  from: location.pathname,
                })
                handler.close()
              },
            },
            {
              key: 'confirm',
              text: '放弃操作',
              style: {
                color: 'var(--adm-color-weak)',
              },
              onClick: () => {
                handler.close()
              },
            },
          ],
        ],
      })
    }
  }

  return {
    isAuth: !!token,
    start,
  }
}
