export interface ICategory {
  id: string;
  name: string;
  link: string;
}

export const parseCategory = (id: string, data: any) => ({
  id: id,
  name: data.name,
  link: data.link
});
