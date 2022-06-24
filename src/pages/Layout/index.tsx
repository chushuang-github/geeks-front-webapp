import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './index.module.scss'

import Icon from '@/components/Icon'

// 导入页面组件，配置路由
import Home from '@/pages/Home'
import Question from '@/pages/Question'
import Video from '@/pages/Video'
import Profile from '@/pages/Profile'

const tabs = [
  { path: '/home/index', icon: 'iconbtn_home', text: '首页' },
  { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
  { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
  { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' },
]

const Layout = () => {
  const history = useHistory()
  const location = useLocation()
  // 切换路由
  const changeRoute = (key: string) => {
    history.push(key)
  }
  return (
    <div className={styles.root}>
      {/* 二级嵌套路由 */}
      <Route exact path="/home/index" component={Home} />
      <Route path="/home/question" component={Question} />
      <Route path="/home/video" component={Video} />
      <Route path="/home/profile" component={Profile} />

      <TabBar className="tab-bar" activeKey={location.pathname} onChange={changeRoute}>
        {tabs.map((item) => (
          <TabBar.Item
            key={item.path}
            icon={(active) => (
              <Icon
                type={active ? `${item.icon}_sel` : item.icon}
                className="tab-bar-item-icon"
              />
            )}
            title={item.text}
          />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout
