import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'

type Props = {
  art_id: string
  title: string
  aut_id: string
  aut_name: string
  comm_count: number
  pubdate: string
  cover: {
    type: number
    images: string[]
  }
}

export default function ArticleItem({
  cover,
  title,
  aut_name,
  comm_count,
  pubdate,
}: Props) {
  return (
    <div className={styles.root}>
      <div
        className={classnames(
          'article-content',
          cover.type === 3 && 't3',
          cover.type === 0 && 'none-mt'
        )}
      >
        <h3>{title}</h3>
        {cover.type !== 0 && (
          <div className="article-imgs">
            {cover.images.map((img, index) => (
              <div className="article-img-wrapper" key={index}>
                <img src={img} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={classnames('article-info', { 'none-mt': cover.type === 0 })}
      >
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{pubdate}</span>
        <span className="close">
          <Icon type="iconbtn_essay_close" />
        </span>
      </div>
    </div>
  )
}
