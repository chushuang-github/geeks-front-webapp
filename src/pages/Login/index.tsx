import { useState, useRef, useEffect } from 'react'
import { Button, NavBar, Form, Input } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { login, sendCode } from '@/store/actions/login'
import type { LoginForm } from '@/types/data'
import type { AxiosError } from 'axios' // 引入axios错误对象类型
// 从 antd-mobile 组件库里面引入内部提供的类型
import type { InputRef } from 'antd-mobile/es/components/input'
import styles from './index.module.scss'

const Login = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0) // 验证码的剩余时间
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<{ from: string } | undefined>()
  const [form] = Form.useForm()
  const mobileRef = useRef<InputRef>(null)
  // 函数重新执行，使用useRef可以去记录定时器标识(记录前一次的状态都用useRef)
  const timerRef = useRef<number>(-1)

  useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(timerRef.current)
    }
    // 不可以在这里面清除定时器
    // timeLeft变化，会执行useEffect回调函数，同时去执行上一次回调函数的返回值
    // 我们需要在组件卸载的时候，清除一下定时器就ok了
    // return () => {
    //   window.clearInterval(timerRef.current)
    // }
  }, [timeLeft])
  useEffect(() => {
    return () => {
      // 组件卸载的时候，清除定时器
      window.clearInterval(timerRef.current)
    }
  }, [])

  // 表单提交
  const onFinish = async (values: LoginForm) => {
    try {
      await dispatch(login(values))
      // 此时表示分发action成功，也就是登录成功
      Toast.show({
        content: '登录成功',
        duration: 500,
        afterClose: () => {
          // 返回首页
          history.replace(location.state?.from || '/home/index')
        },
      })
    } catch (error) {
      // 登录失败
      // 默认情况下面error是unknown类型，无法从里面取出错误信息，所以需要对error进类型断言
      // 获取错误的提示信息，此时需要将error对象转成一个类型，AxiosError是axios提供的错误类型
      const e = error as AxiosError<{ message: string }>
      Toast.show({
        content: e.response?.data.message,
        duration: 1000,
      })
    }
  }
  // 发送短信验证码
  const onSendCode = async () => {
    const mobile = (form.getFieldValue('mobile') || '') as string
    // 判断当前的手机号是否满足校验要求
    const isError = !!form.getFieldError('mobile').length
    if (isError || mobile.trim() === '') {
      // 手机号不满足要求，然Input输入框组件获取焦点
      mobileRef.current?.focus()
      return
    }
    // 手机号合法：调用发送验证码的action
    try {
      await dispatch(sendCode(mobile))
      Toast.show({
        content: '验证码已发送',
      })
      // 开始倒计时
      setTimeLeft(60)
      // 注意：此处需要使用 window.setInterval，而不能单独的使用setInterval
      // 因为 setInterval 默认返回 NodeJS.Timer 类型
      // 使用 window.setInterval 后，返回值才是 number 类型的数值
      timerRef.current = window.setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } catch (error) {
      // 将error为unknown类型，断言成AxiosError<{ message: string }>类型
      // 如果error为unknown类型，从unknown类型里面取任意的属性都会报错
      const e = error as AxiosError<{ message: string }>
      Toast.show({
        content: e.response?.data.message,
      })
    }
  }

  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form form={form} onFinish={onFinish}>
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input
              ref={mobileRef}
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
            extra={
              <span
                className="code-extra"
                onClick={timeLeft === 0 ? onSendCode : undefined}
              >
                {/* 判断是否开启定时器，没开启展示 发送验证码，开启后展示倒计时 */}
                {timeLeft === 0 ? '发送验证码' : `${timeLeft}s后重新获取`}
              </span>
            }
          >
            <Input
              placeholder="请输入验证码"
              autoComplete="off"
              maxLength={6}
            />
          </Form.Item>

          {/* noStyle 表示不提供 Form.Item 自带的样式 */}
          {/* shouldUpdate表示其它任意表单的更新，都会导致该form-item内容的重新渲染 */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              // 判断当前是否需要将按钮禁用
              // 1) 表单校验没有通过，按钮禁用；2) 用户没有进行表单操作，按钮禁用

              // getFieldsError() 获取所有字段名对应的错误信息
              // 如果需要获取表单校验是否成功，只需要获取上述errors数组的长度(大于0表示校验没有通过)
              //  如果长度大于0说明有错误，表示：表单校验失败；否则，表单校验成功
              const hasError =
                form.getFieldsError().filter((item) => item.errors.length > 0)
                  .length > 0

              // isFieldsTouched(true) 用来判断登录表单中的所有表单项是否被操作过
              //  如果都操作过，结果为：true； 否则，为 false
              const untouched = !form.isFieldsTouched(true)
              const disabled = untouched || hasError
              return (
                <Button
                  block
                  type="submit"
                  color="primary"
                  className="login-submit"
                  disabled={disabled}
                >
                  登 录
                </Button>
              )
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
