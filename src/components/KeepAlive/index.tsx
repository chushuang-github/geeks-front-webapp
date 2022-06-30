import type { ReactNode } from 'react'
import { Route, RouteProps } from 'react-router-dom'

export const KeepAlive = ({ children, ...rest }: RouteProps) => {
  return (
    <Route
      {...rest}
      children={(props) => {
        const isMatch = props.match !== null

        return (
          <div
            style={{
              height: '100%',
              display: isMatch ? 'block' : 'none',
            }}
          >
            {children as ReactNode}
          </div>
        )
      }}
    />
  )
}
