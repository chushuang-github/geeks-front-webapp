import type { ArticleInfo, ArticleComment } from '@/types/data'
import type { ArticleAction, ResetAction } from '@/types/store'

type ArticleState = {
  detail: ArticleInfo // 文章详情
  comment: ArticleComment // 文章/评论 的评论数据
}
const initialState = {
  detail: {},
  comment: {
    results: [] as ArticleComment['results'], // 评论的列表
  },
} as ArticleState

export const article = (
  state = initialState,
  action: ArticleAction | ResetAction
): ArticleState => {
  switch (action.type) {
    case 'article/get':
      return { ...state, detail: action.payload }
    case 'article/getarticlecomments':
      // redux是一个集中式的状态管理，数据是不会自己刷新的，如果评论只追加会有问题的
      // 不同文章的数据，对应同一个redux状态管理数据(注意数据是覆盖还是追加)
      // 操作：进入文章详情页 -> 退出文章详情页 -> 进入文章详情页
      // 同一个文章这样做的话，评论会重复追加；不同文章这样做的话，评论不对且混乱
      // 进入文章详情做第一次评论加载的时候，直接覆盖掉原数据
      const { total_count, results, last_id, end_id, actionType } =
        action.payload
      return {
        ...state,
        comment: {
          total_count,
          end_id,
          last_id,
          results:
            actionType === 'append'
              ? [...state.comment.results, ...results]
              : [...results],
        },
      }
    case 'article/addarticlecomment':
      return {
        ...state,
        detail: {
          ...state.detail,
          comm_count: state.detail.comm_count + 1,
        },
        comment: {
          ...state.comment,
          total_count: state.comment.total_count + 1,
          results: [action.payload, ...state.comment.results],
        },
      }
    case 'reset':
      if (action.payload === 'article') {
        return initialState
      }
      return state
    default:
      return state
  }
}
