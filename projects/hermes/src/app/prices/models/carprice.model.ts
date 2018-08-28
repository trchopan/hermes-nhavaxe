export interface ICarPrice {
  id: string;
  image: string;
  model: string;
  brand: string;
  type: string;
  origin: string;
  engine: string;
  power: string;
  torque: string;
  listPrice: number;
  salePrice: number;
  contacts: string;
  link: string;
  publishAt: number;
}

export function parseCarPrice(id: string, data: any): ICarPrice {
  return {
    id: id,
    image: data.image || "",
    model: data.model || "",
    brand: data.brand || "",
    type: data.type || "",
    origin: data.origin || "",
    engine: data.engine || "",
    power: data.power || "",
    torque: data.torque || "",
    listPrice: data.listPrice || 0,
    salePrice: data.salePrice || 0,
    contacts: data.contacts || "",
    link: data.link || "",
    publishAt: data.publishAt
  };
}
