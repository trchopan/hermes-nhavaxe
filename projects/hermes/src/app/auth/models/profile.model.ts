export interface IProfile {
  fullname: string;
  avatar: string;
  phone: string;
  points: number;
  greeting: string;
}

export function parseProfile(data: any): IProfile {
  return {
    fullname: data.fullname || "",
    avatar: data.avatar || "",
    phone: data.phone || "",
    points: data.points || 0,
    greeting: data.greeting || ""
  };
}
