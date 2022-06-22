import React from 'react'
import classnames from 'classnames'

// 定义组件接收参数的类型
type Props = {
  type: string // 表示Icon图标的类型
  onClick?: () => void // 点击事件(可选参数)
  className?: string // icon 的自定义样式
}

export default function Icon({ type, className, onClick }: Props) {
  return (
    <svg
      className={classnames('icon', className)}
      aria-hidden="true"
      onClick={onClick}
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}
