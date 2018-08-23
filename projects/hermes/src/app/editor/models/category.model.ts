export interface ICategory {
  id: string;
  name: string;
  link: string;
  position: number;
}

export const parseCategory = (id: string, data: any) => ({
  id: id,
  name: data.name,
  link: data.link,
  position: data.position,
});
