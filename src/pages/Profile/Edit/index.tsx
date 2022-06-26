import { useState } from 'react'
import { Button, List, NavBar, Popup, Toast, Dialog } from 'antd-mobile'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout as logoutAction } from '@/store/actions/login'
import { getUserProfile, updateUserProfile } from '@/store/actions/profile'
import { useInitialState } from '@/hooks/use-initial-state'
import EditInput from './components/EditInput'
import styles from './index.module.scss'

const Item = List.Item

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [InputVisible, setInputVisible] = useState<boolean>(false) // 控制昵称弹出层
  const { profile } = useInitialState(getUserProfile, 'profile')

  // 关闭昵称的弹出层
  const onInputHide = () => {
    setInputVisible(false)
  }
  // 更新昵称
  const onSave = async (name: string) => {
    await dispatch(updateUserProfile({ name }))
    Toast.show({
      content: '更新成功',
      duration: 1000,
    })
    // 关闭弹出层
    onInputHide()
  }
  // 退出登录
  const logout = () => {
    const handler = Dialog.show({
      title: '温馨提示',
      content: '亲，你确定退出吗？',
      closeOnMaskClick: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            onClick: () => {
              handler.close()
            },
          },
          {
            key: 'confirm',
            text: '退出',
            style: {
              color: 'var(--adm-color-weak)',
            },
            onClick: () => {
              dispatch(logoutAction())
              handler.close()
              history.replace('/login')
            },
          },
        ],
      ],
    })
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          className="nav-bar"
          onBack={() => history.go(-1)}
          style={{ '--border-bottom': '1px solid #F0F0F0' }}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <Item
              // extra 表示右侧的额外信息
              extra={
                <span className="avatar-wrapper">
                  <img width={24} height={24} src={profile.photo} alt="" />
                </span>
              }
              arrow
            >
              头像
            </Item>
            <Item
              arrow
              extra={profile.name}
              onClick={() => setInputVisible(true)}
            >
              昵称
            </Item>
            <Item
              arrow
              extra={
                <span className={classNames('intro', 'normal')}>
                  {profile.intro || '未填写'}
                </span>
              }
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item arrow extra={profile.gender === 0 ? '男' : '女'}>
              性别
            </Item>
            <Item arrow extra={profile.birthday}>
              生日
            </Item>
          </List>
        </div>

        <div className="logout">
          <Button className="btn" onClick={logout}>
            退出登录
          </Button>
        </div>
      </div>

      <Popup visible={InputVisible} position="right" destroyOnClose>
        <EditInput
          onClose={onInputHide}
          onUpdateName={onSave}
          value={profile.name}
        />
      </Popup>
    </div>
  )
}

export default ProfileEdit
