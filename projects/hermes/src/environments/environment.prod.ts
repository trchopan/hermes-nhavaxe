import { firebase } from "@editor/environments/enviroment.conf";

export const environment = {
  production: true,
  firebase: firebase,
  ArticlesCollection: "articles",
  BodyCollection: "body",
  CategoriesCollection: "categories",
  CollectionPagingLimit: 10,
  topAmount: 6
};
