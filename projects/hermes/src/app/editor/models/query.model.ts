export const statusMap = {
  draft: { value: "draft", text: "Đang soạn" },
  pending: { value: "pending", text: "Chờ duyệt" },
  published: { value: "published", text: "Đã duyệt" },
  unpublished: { value: "unpublished", text: "Gở bỏ" }
};

export interface IQuery {
  fromDate: number;
  creatorId: string | null;
  status: "draft" | "pending" | "published" | "unpublished" | null;
  range: "day" | "month";
}
