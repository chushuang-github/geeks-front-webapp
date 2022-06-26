import React, { ReactNode } from 'react'
import { getToken } from '@/utils/token'
import { Route, Redirect, useLocation } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'

// 检查token是否过期 (用户身份是否过期)
const isAuth = () => {
  return !!getToken().token
}
// 使用：<AuthRoute><Home /></AuthRoute>
// AuthRoute 组件里面的 children 就是<Home />组件
export default function AuthRoute({ children, ...rest }: RouteProps) {
  const loaction = useLocation()
  return (
    <Route
      {...rest}
      render={() => {
        if (isAuth()) {
          return children as ReactNode
        }
        // 没有token
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: loaction.pathname },
            }}
          />
        )
      }}
    />
  )
}
