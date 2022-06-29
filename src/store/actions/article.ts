import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type { ArticleInfoResponse, ArticleCommentResponse } from '@/types/data'

// 获取文章详情
export const getArticle = (articleId: string): RootThunkAction => {
  return async (dispatch) => {
    const res = (await http.get(
      `/articles/${articleId}`
    )) as ArticleInfoResponse
    dispatch({
      type: 'article/get',
      payload: res.data,
    })
  }
}

// 获取评论列表数据
export const getComments = (
  type: string, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
  source: string, // 源id，文章id或评论id
  offset: string | null, //	获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
  actionType: 'replace' | 'append'
): RootThunkAction => {
  return async (dispatch) => {
    const res = (await http.get('/comments', {
      params: {
        type,
        source,
        offset,
      },
    })) as ArticleCommentResponse
    dispatch({
      type: 'article/getarticlecomments',
      payload: { ...res.data, actionType },
    })
  }
}
