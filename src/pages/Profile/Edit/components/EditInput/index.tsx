import { useState } from 'react'
import { Input, NavBar } from 'antd-mobile'
import styles from './index.module.scss'

type Props = {
  onClose: () => void
  onUpdateName: (name: string) => void
  value: string
}

const EditInput = ({ onClose, onUpdateName, value }: Props) => {
  const [inputValue, setInputValue] = useState<string>(value)

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        right={
          <span className="commit-btn" onClick={() => onUpdateName(inputValue)}>
            提交
          </span>
        }
        onBack={onClose}
      >
        编辑昵称
      </NavBar>

      <div className="edit-input-content">
        <h3>昵称</h3>
        <div className="input-wrap">
          <Input
            value={inputValue}
            placeholder="请输入"
            onChange={setInputValue}
          />
        </div>
      </div>
    </div>
  )
}

export default EditInput
