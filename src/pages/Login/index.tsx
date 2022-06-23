import { Button, NavBar, Form, Input } from 'antd-mobile'
import type { LoginForm } from '@/types/data'
import styles from './index.module.scss'

const Login = () => {
  const onFinish = (values: LoginForm) => {
    console.log(values)
  }
  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form onFinish={onFinish}>
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input
              placeholder="请输入手机号"
              autoComplete="off"
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            className="login-item"
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码格式不正确' },
            ]}
            extra={<span className="code-extra">发送验证码</span>}
          >
            <Input
              placeholder="请输入验证码"
              autoComplete="off"
              maxLength={6}
            />
          </Form.Item>

          {/* noStyle 表示不提供 Form.Item 自带的样式 */}
          <Form.Item noStyle>
            <Button
              block
              type="submit"
              color="primary"
              className="login-submit"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
