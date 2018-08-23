export interface IArticle {
  id: string;
  coverImg: string;
  title: string;
  sapo: string;
  video: string;
  style: string;
  categoryId: string;
  categoryName: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  publisher: string;
  reference: string;
  status: string;
  publishAt: number;
  modifiedAt: number;
  managerId: string;
  managerName: string;
  note: string;
  tags: string[];
  bodyData?: IArticleBody;
}

export interface IArticleBody {
  id: string;
  body: string;
  modifiedAt: number;
  modifiedBy: string;
  modifierId: string;
}

export const parseArticleBody = (id: string, bodyData: any): IArticleBody => ({
  id: id,
  body: bodyData.body,
  modifiedAt: bodyData.modifiedAt,
  modifiedBy: bodyData.modifiedBy,
  modifierId: bodyData.modifierId
});

export const parseArticle = (id: string, articleData: any): IArticle => ({
  id: id,
  coverImg: articleData.coverImg || null,
  title: articleData.title || null,
  sapo: articleData.sapo || null,
  video: articleData.video || null,
  style: articleData.style || "article",
  categoryId: articleData.categoryId || null,
  categoryName: articleData.categoryName || null,
  creatorName: articleData.creatorName || null,
  creatorAvatar: articleData.creatorAvatar || null,
  creatorId: articleData.creatorId || null,
  publisher: articleData.publisher || null,
  reference: articleData.reference || null,
  status: articleData.status || null,
  publishAt: articleData.publishAt || 0,
  modifiedAt: articleData.modifiedAt || 0,
  managerId: articleData.managerId || null,
  managerName: articleData.managerName || null,
  note: articleData.note || null,
  tags: articleData.tags || []
});
