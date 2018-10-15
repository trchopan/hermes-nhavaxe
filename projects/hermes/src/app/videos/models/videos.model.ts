export const StubVideos: IVideo[] = [
  {
    link: "https://www.youtube.com/watch?v=b4rpUeVPe8I",
    coverImg:
      "https://media.laodong.vn/Storage/NewsPortal/2018/10/14/635929/St-2.jpg",
    title: "Test youtube videos 1"
  },
  {
    link: "https://www.youtube.com/watch?v=b4rpUeVPe8I",
    coverImg:
      "https://media.laodong.vn/Storage/NewsPortal/2018/10/14/635929/St-2.jpg",
    title: "Pfusng youtube videos 2"
  },
  {
    link: "https://www.youtube.com/watch?v=b4rpUeVPe8I",
    coverImg:
      "https://media.laodong.vn/Storage/NewsPortal/2018/10/14/635929/St-2.jpg",
    title: "OURHY youtube videos 3"
  },
  {
    link: "https://www.youtube.com/watch?v=b4rpUeVPe8I",
    coverImg:
      "https://media.laodong.vn/Storage/NewsPortal/2018/10/14/635929/St-2.jpg",
    title: "artrsgsg youtube videos 4"
  },
  {
    link: "https://www.youtube.com/watch?v=b4rpUeVPe8I",
    coverImg:
      "https://media.laodong.vn/Storage/NewsPortal/2018/10/14/635929/St-2.jpg",
    title: "Test youtube videos 1"
  }
];

export interface IVideoData {
  creatorId: string,
  creatorName: string,
  publishAt: number,
  videos: IVideo[]
}

export interface IVideo {
  link: string;
  coverImg: string;
  title: string;
}

export const parseVideo = (data: any): IVideo => ({
  link: data.link || "",
  coverImg: data.coverImg || "",
  title: data.title || ""
});
