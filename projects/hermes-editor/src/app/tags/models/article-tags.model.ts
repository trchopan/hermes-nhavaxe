export interface IArticleTags {
  articleId: string;
  publishAt: number;
  tag: string;
  sapo: string;
  title: string;
  coverImg: string;
  relevant: number;
}

export const parseArticleTags = (data: any): IArticleTags => ({
  articleId: data.articleId,
  publishAt: data.publishAt,
  tag: data.tag,
  sapo: data.sapo,
  title: data.title,
  coverImg: data.coverImg,
  relevant: 1
});
