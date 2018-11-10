export const statusMap = [
  { value: "draft", text: "Đang soạn" },
  { value: "pending", text: "Chờ duyệt" },
  { value: "published", text: "Đã duyệt" },
  { value: "unpublished", text: "Gở bỏ" }
];

export interface IQuery {
  fromDate: number;
  creatorId: string | null;
  status: "draft" | "pending" | "published" | "unpublished" | null;
  range: "day" | "month";
}
