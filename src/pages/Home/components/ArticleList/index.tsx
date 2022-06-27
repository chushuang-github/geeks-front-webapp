import { useDispatch, useSelector } from 'react-redux'
import ArticleItem from '@/components/ArticleItem'
import { InfiniteScroll, PullToRefresh } from 'antd-mobile'
import { getArticleList } from '@/store/actions/home'
import { RootState } from '@/types/store'
import styles from './index.module.scss'

type Props = {
  channelId: number
}

const ArticleList = ({ channelId }: Props) => {
  const dispatch = useDispatch()
  const articles = useSelector((state: RootState) => state.home.channelArticles)

  // 第一次请求，使用当前最新时间戳；后面每次都使用上次请求后端返回的事件戳
  // 可以保证results是一个数组 (有可能为空数组)
  const { results, pre_timestamp } = articles[channelId] ?? {
    results: [],
    pre_timestamp: Date.now().toString(),
  }
  // 当pre_timestamp值为空的时候，上拉加载结束
  const hasMore = !!pre_timestamp
  // 上拉加载
  const loadMore = async () => {
    await dispatch(getArticleList(channelId, pre_timestamp, 'append'))
  }

  // 下拉刷新
  const onRefresh = async () => {
    await dispatch(getArticleList(channelId, Date.now().toString(), 'replace'))
  }
  return (
    <div className={styles.root}>
      <PullToRefresh onRefresh={onRefresh}>
        <div className="article-item">
          {results.length > 0 &&
            results.map((item) => {
              return <ArticleItem key={item.art_id} {...item} />
            })}
        </div>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  )
}

export default ArticleList
