import { Tabs } from 'antd-mobile'
import Icon from '@/components/Icon'
import { useInitialState } from '@/hooks/use-initial-state'
import { getUserChannel } from '@/store/actions/home'
import ArticleList from './components/ArticleList'
import styles from './index.module.scss'

const Home = () => {
  const { userChannels } = useInitialState(getUserChannel, 'home')

  return (
    <div className={styles.root}>
      {userChannels.length > 0 && (
        <Tabs className="tabs" activeLineMode="full">
          {userChannels.map((channel) => {
            return (
              <Tabs.Tab title={channel.name} key={channel.id}>
                <ArticleList channelId={channel.id} />
              </Tabs.Tab>
            )
          })}
        </Tabs>
      )}

      <div className="tabs-opration">
        <Icon type="iconbtn_search" />
        <Icon type="iconbtn_channel" />
      </div>
    </div>
  )
}

export default Home
