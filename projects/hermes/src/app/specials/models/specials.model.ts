import { IArticle } from "@app/app/editor/models/article.model";

export const SpecialsAmount = 9;

export interface ISpecials {
  title: string;
  articles: IArticle[];
}

export function parseSpecials(data: any): ISpecials {
  return {
    title: data.title || "",
    articles: data.articles || []
  };
}
