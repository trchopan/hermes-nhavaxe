export const TypeOptions = {
  image: { id: "image", text: "Hình (jpeg, png, gif, v.v)" },
  html5: { id: "html5", text: "Định dạng web HTML5" },
  youtube: { id: "youtube", text: "Video youtube" }
};
export const AreaOptions = {
  longTop: { id: "long-top", text: "Trên cùng 940x242" },
  bigRight: { id: "big-right", text: "Cột bên phải 300x600" },
  bigSticky: { id: "big-sticky", text: "Dính sticky 300x600" },
  smallRelate: { id: "small-relate", text: "Bài liên quan 289x195" },
  articleList: { id: "article-list", text: "Danh sách bài 594x119" },
  inpage: { id: "inpage", text: "Nội dung bài 300x600" }
};
export const StatusOptions = {
  active: { id: "active", text: "Hoạt động" },
  disabled: { id: "disabled", text: "Ngưng" }
};

export interface IBanner {
  id: string;
  customer: string;
  contentLink: string;
  creatorId: string;
  managerId: string;
  type: string;
  link: string;
  area: string;
  status: string;
  count: number;
  expire: number;
}

export function parseBanner(id: string, data: any): IBanner {
  return {
    id: id,
    customer: data.customer || "",
    contentLink: data.contentLink || "",
    creatorId: data.creatorId || "",
    managerId: data.managerId || "",
    type: data.type || "",
    link: data.link || "",
    area: data.area || "",
    status: data.status || StatusOptions.disabled.id,
    count: data.count || 0,
    expire: data.expire || 0
  };
}
