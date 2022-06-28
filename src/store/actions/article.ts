import { http } from '@/utils/http'
import type { RootThunkAction } from '@/types/store'
import type { ArticleInfoResponse } from '@/types/data'

// 获取文章详情
export const getArticle = (articleId: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get(`/articles/${articleId}`) as ArticleInfoResponse
    dispatch({
      type: 'article/get',
      payload: res.data
    })
  }
}
