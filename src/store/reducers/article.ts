import type { ArticleInfo } from "@/types/data";
import type { ArticleAction } from "@/types/store";

type ArticleState = {
  detail: ArticleInfo
}
const initialState = {
  detail: {},
  // comment: 
} as ArticleState

export const article = (state = initialState, action: ArticleAction): ArticleState => {
  switch(action.type) {
    case 'article/get':
      return { ...state, detail: action.payload }
    default:
      return state
  }
}