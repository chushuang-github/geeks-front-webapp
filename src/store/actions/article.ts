import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type { ArticleInfoResponse, ArticleCommentResponse, AddArticleComponentResponse } from '@/types/data'

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

// 发表评论
// target：评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
// content：评论的内容
// artId：文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
export const addArticleComment = (
  target: string,
  content: string,
  artId?: string
): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.post('/comments', {
      target,
      content,
    }) as AddArticleComponentResponse
    dispatch({
      type: 'article/addarticlecomment',
      payload: res.data.new_obj
    })
  }
}
