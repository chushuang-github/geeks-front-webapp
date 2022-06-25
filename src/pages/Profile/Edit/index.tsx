import { Button, List, NavBar } from 'antd-mobile'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { getUserProfile } from '@/store/actions/profile'
import { useInitialState } from '@/hooks/use-initial-state'
import styles from './index.module.scss'

const Item = List.Item

const ProfileEdit = () => {
  const history = useHistory()
  const { profile } = useInitialState(getUserProfile, 'profile')

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
            <Item arrow extra={profile.name}>
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
          <Button className="btn">退出登录</Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit
