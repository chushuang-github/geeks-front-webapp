import { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  getArticle,
  getComments,
  addArticleComment,
} from '@/store/actions/article'
import { useInitialState } from '@/hooks/use-initial-state'
import { useAuthSet } from '@/hooks/use-auth-set'
import { useResetRedux } from '@/hooks/use-reset-redux'
import { NavBar, InfiniteScroll, Popup, Toast } from 'antd-mobile'
import Icon from '@/components/Icon'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import CommentInput from './components/CommentInput'
import NoneComment from '@/components/NoneComment'
import classNames from 'classnames'
import dayjs from 'dayjs'
// 导入本地化格式插件
import localizedFormat from 'dayjs/plugin/localizedFormat'
// react骨架屏组件
import ContentLoader from 'react-content-loader'
// 对html字符串进行消毒
import DOMPurify from 'dompurify'
// 代码高亮
import hljs from 'highlight.js'
// import 'highlight.js/styles/github-dark.css'
import 'highlight.js/styles/vs2015.css'
import styles from './index.module.scss'

// '2021-10-24 10:24:00' => '2021年10月24日'
dayjs.extend(localizedFormat)

hljs.configure({
  // 忽略警告
  ignoreUnescapedHTML: true,
})

// 评论的类型
// 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
enum CommentType {
  Article = 'a',
  Comment = 'c',
}

const Article = () => {
  const [commentVisible, setCommentVisible] = useState(false) // 发表评论的弹出层
  const [showComment, setShowComment] = useState(false) // 是否显示评论区内容
  const wrapperRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const history = useHistory()
  const params = useParams<{ articleId: string }>()
  const dispatch = useDispatch()
  // 权限验证，是否登录
  const { isAuth, start } = useAuthSet()
  // 退出文章详情页，进行redux数据清理
  useResetRedux('article')

  // 自定义hook获取文章详情
  const { detail } = useInitialState(
    () => getArticle(params.articleId),
    'article'
  )
  // 自定义hook获取评论列表
  const { comment } = useInitialState(
    () => getComments(CommentType.Article, params.articleId, null, 'replace'),
    'article'
  )

  // 文章详情 代码内容 高亮
  // 监听，等到整个页面渲染完毕，并且文章有内容，就进行高亮处理
  useEffect(() => {
    // detail是接口返回的文章数据，当数据返回的时候，进行高亮处理
    // useEffect执行时机：页面dom元素渲染完成之后，执行useEffect里面的回调函数
    if (detail.art_id) {
      const dgHtmlDOM = document.querySelector('.dg-html')
      // 找到所有pre标签下面的code标签
      const codes = dgHtmlDOM?.querySelectorAll<HTMLElement>('pre code')
      if (codes && codes.length > 0) {
        codes.forEach((el) => {
          // 让每个 code 标签内容实现代码高亮
          hljs.highlightElement(el)
        })
        return
      }

      // 直接找到所有的 pre 标签
      const pres = dgHtmlDOM?.querySelectorAll('pre')
      if (pres && pres.length > 0) {
        pres.forEach((el) => {
          // 让每个 pre 标签内容实现代码高亮
          hljs.highlightElement(el)
        })
      }
    }
  }, [detail])

  // 点击评论，页面滚动到评论的位置
  const onScrollTop = () => {
    if (showComment) {
      // 当前是显示评论的，需要回到顶部
      wrapperRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // 当前不显示评论，需要显示评论
      commentRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    setShowComment(!showComment)
  }

  // 发表评论
  const onAddComment = async (content: string) => {
    await dispatch(addArticleComment(params.articleId, content))
    setCommentVisible(false)
    commentRef.current?.scrollIntoView()
    Toast.show({
      content: '评论成功',
      duration: 1000,
    })
  }

  // 加载更多评论
  const loadMoreComments = async () => {
    await dispatch(
      getComments(
        CommentType.Article,
        params.articleId,
        comment.last_id,
        'append'
      )
    )
  }

  const {
    title,
    pubdate,
    read_count,
    like_count,
    comm_count,
    aut_name,
    aut_photo,
    is_followed,
    content,
  } = detail

  const renderArticle = () => {
    // 文章详情
    return (
      <div className="wrapper">
        <div className="article-wrapper" ref={wrapperRef}>
          <div className="header">
            <h1 className="title">{title}</h1>

            <div className="info">
              <span>{dayjs(pubdate).format('LL')}</span>
              <span>{read_count} 阅读</span>
              <span>{comm_count} 评论</span>
            </div>

            <div className="author">
              <img src={aut_photo} alt="" />
              <span className="name">{aut_name}</span>
              <span
                className={classNames('follow', is_followed ? 'followed' : '')}
              >
                {is_followed ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          <div className="content">
            <div
              className="content-html dg-html"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
            <div className="date">
              发布文章时间：{dayjs(pubdate).format('LL')}
            </div>
          </div>
        </div>

        <div className="comment" ref={commentRef}>
          <div className="comment-header">
            <span>全部评论（{comm_count}）</span>
            <span>{like_count} 点赞</span>
          </div>

          {/* 文章评论列表 */}
          {comment.results.length > 0 ? (
            <div className="comment-list">
              {comment.results.map((item) => (
                <CommentItem key={item.com_id} {...item} />
              ))}

              <InfiniteScroll
                hasMore={comment.last_id !== comment.end_id}
                loadMore={loadMoreComments}
              />
            </div>
          ) : (
            <NoneComment />
          )}
        </div>
      </div>
    )
  }

  // 评论弹出层
  const renderComment = () => (
    <Popup
      visible={commentVisible}
      bodyStyle={{ height: '100vh' }}
      destroyOnClose
    >
      <CommentInput
        onClose={() => setCommentVisible(false)}
        onAddComment={onAddComment}
      />
    </Popup>
  )

  // 骨架屏
  const showLoader = () => (
    <ContentLoader
      speed={2}
      width={375}
      height={230}
      viewBox="0 0 375 230"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="16" y="8" rx="3" ry="3" width="340" height="10" />
      <rect x="16" y="26" rx="0" ry="0" width="70" height="6" />
      <rect x="96" y="26" rx="0" ry="0" width="50" height="6" />
      <rect x="156" y="26" rx="0" ry="0" width="50" height="6" />
      <circle cx="33" cy="69" r="17" />
      <rect x="60" y="65" rx="0" ry="0" width="45" height="6" />
      <rect x="304" y="65" rx="0" ry="0" width="52" height="6" />
      <rect x="16" y="114" rx="0" ry="0" width="340" height="15" />
      <rect x="263" y="208" rx="0" ry="0" width="94" height="19" />
      <rect x="16" y="141" rx="0" ry="0" width="340" height="15" />
      <rect x="16" y="166" rx="0" ry="0" width="340" height="15" />
    </ContentLoader>
  )

  if (!detail.art_id) {
    // 如果没有文章id，表示数据还没加载出来，就显示骨架屏组件
    return showLoader()
  }

  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {true && (
            <div className="nav-author">
              <img src={aut_photo} alt="" />
              <span className="name">{aut_name}</span>
              <span
                className={classNames('follow', is_followed ? 'followed' : '')}
              >
                {is_followed ? '已关注' : '关注'}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}

        {/* 发布评论弹出层 */}
        {renderComment()}

        {/* 底部评论栏 */}
        <CommentFooter
          onCommentPopup={() => (isAuth ? setCommentVisible(true) : start())}
          onScrollTop={onScrollTop}
          {...detail}
        />
      </div>
    </div>
  )
}

export default Article
