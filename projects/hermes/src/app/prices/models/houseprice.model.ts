export interface IHousePrice {
  id: string,
  image: string,
  project: string,
  investor: string,
  location: string,
  scale: string,
  progress: string,
  salePerks: string,
  facilities: string,
  avgPrice: number,
  avgResalePrice: number,
  contacts: string,
  link: string,
  publishAt: number
}

export function parseHousePrice(id: string, data: any): IHousePrice {
  return {
    id: id,
    image: data.image || "",
    project: data.project || "",
    investor: data.investor || "",
    location: data.location || "",
    scale: data.scale || "",
    progress: data.progress || "",
    salePerks: data.salePerks || "",
    facilities: data.facilities || "",
    avgPrice: data.avgPrice || 0,
    avgResalePrice: data.avgResalePrice || 0,
    contacts: data.contacts || "",
    link: data.link || "",
    publishAt: data.publishAt
  }
}