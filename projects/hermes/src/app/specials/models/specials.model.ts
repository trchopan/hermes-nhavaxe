export interface ISpecials {
  title: string;
  mainOne: string;
  mainTwo: string;
  subOne: string;
  subTwo: string;
  subThree: string;
  subFour: string;
  subFive: string;
  subSix: string;
  subSeven: string;
}

export function parseSpecials(data: any): ISpecials {
  return {
    title: data.title || "",
    mainOne: data.mainOne || "",
    mainTwo: data.mainTwo || "",
    subOne: data.subOne || "",
    subTwo: data.subTwo || "",
    subThree: data.subThree || "",
    subFour: data.subFour || "",
    subFive: data.subFive || "",
    subSix: data.subSix || "",
    subSeven: data.subSeven || ""
  };
}
