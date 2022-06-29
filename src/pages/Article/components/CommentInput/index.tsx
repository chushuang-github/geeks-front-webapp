import { useState, useRef, useEffect } from 'react'
import { NavBar, TextArea } from 'antd-mobile'
import type { TextAreaRef } from 'antd-mobile/es/components/text-area'
import styles from './index.module.scss'

// 该组件的两个使用场景：1 文章评论  2 评论回复
type Props = {
  name?: string
  onClose?: () => void
  onAddComment: (content: string) => void
}

const CommentInput = ({ onClose, onAddComment, name }: Props) => {
  const [value, setValue] = useState<string>('')
  const textAreaRef = useRef<TextAreaRef>(null)

  const onChange = (value: string) => {
    setValue(value)
  }

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        right={
          <span className="publish" onClick={() => onAddComment(value)}>
            发表
          </span>
        }
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>

      <div className="input-area">
        {name && <div className="at">@{name}:</div>}
        <TextArea
          value={value}
          onChange={onChange}
          ref={textAreaRef}
          placeholder="说点什么~"
          rows={10}
        />
      </div>
    </div>
  )
}

export default CommentInput
