export interface IArticle {
  id: string;
  coverImg: string;
  title: string;
  sapo: string;
  video: string;
  body: string;
  style: string;
  categoryId: string;
  categoryName: string;
  creatorName: string;
  creatorAvatar: string;
  creatorId: string;
  publisher: string;
  reference: string;
  status: string;
  publishAt: number;
  modifiedAt: number;
  managerId: string;
  managerName: string;
  note: string;
  tags: string;
}

export function parseArticle(id: string, data: any): IArticle {
  return {
    id: id || null,
    coverImg: data.coverImg || null,
    title: data.title || null,
    sapo: data.sapo || null,
    video: data.video || null,
    body: data.body || null,
    style: data.style || "article",
    categoryId: data.categoryId || null,
    categoryName: data.categoryName || null,
    creatorName: data.creatorName || null,
    creatorAvatar: data.creatorAvatar || null,
    creatorId: data.creatorId || null,
    publisher: data.publisher || null,
    reference: data.reference || null,
    status: data.status || null,
    publishAt: data.publishAt || 0,
    modifiedAt: data.modifiedAt || 0,
    managerId: data.managerId || null,
    managerName: data.managerName || null,
    note: data.note || null,
    tags: data.tags || null
  };
}
