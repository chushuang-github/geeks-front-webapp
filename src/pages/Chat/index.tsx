import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Input, NavBar } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { getToken } from '@/utils/token'
import Icon from '@/components/Icon'
import classnames from 'classnames'
import styles from './index.module.scss'

type ChatRecord = {
  message: string
  type: 'user' | 'xz'
}

const Chat = () => {
  const [chatList, setChatList] = useState<ChatRecord[]>([])
  const [value, setValue] = useState('')
  const history = useHistory()
  const socketRef = useRef<Socket>()
  const chatListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 建立websocket通讯连接
    const socketIO = io('http://toutiao.itheima.net', {
      query: {
        token: getToken().token,
      },
      transports: ['websocket'],
    })
    // 和websocket连接成功
    socketIO.on('connect', () => {
      console.log('和极客园小智同学连接成功')
      socketRef.current = socketIO
      setChatList([
        { type: 'xz', message: '你好，我是小智' },
        {
          type: 'xz',
          message: '欢迎来到黑马程序员，请问您有什么想要了解的吗？',
        },
      ])
    })
    // 断开连接
    socketIO.on('disconnect', () => {
      console.log('和极客园小智同学断开连接')
    })
    // 接收到消息
    socketIO.on('message', (res) => {
      setChatList((list) => {
        return [...list, { type: 'xz', message: res.msg }]
      })
    })
    return () => {
      // 断开连接
      socketIO.close()
    }
  }, [])

  // 监听聊天内容的改变，只要聊天内容改变了，就滚动列表列表到最底部
  useEffect(() => {
    const chatListDOM = chatListRef.current
    if (!chatListDOM) return

    chatListDOM.scrollTop = chatListDOM.scrollHeight
  }, [chatList])

  // 发送消息
  const onSendMsg = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter' && !!value.trim()) {
      socketRef.current?.emit('message', {
        msg: value.trim(),
        timestamp: Date.now().toString(),
      })
      setValue('')
      setChatList([...chatList, { type: 'user', message: value.trim() }])
    }
  }

  return (
    <div className={styles.root}>
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      <div className="chat-list" ref={chatListRef}>
        {chatList.map((item, index) => (
          <div
            key={index}
            className={classnames(
              'chat-item',
              item.type === 'xz' ? 'self' : 'user'
            )}
          >
            {item.type === 'xz' ? (
              <Icon type="iconbtn_xiaozhitongxue" />
            ) : (
              <img src="http://geek.itheima.net/images/user_head.jpg" alt="" />
            )}
            <div className="message">{item.message}</div>
          </div>
        ))}
      </div>

      <div className="input-footer">
        <Input
          value={value}
          onChange={setValue}
          onKeyDown={onSendMsg}
          className="no-border"
          placeholder="请描述您的问题"
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
