export interface Files {
    item: string;
    id:string;
    type:string;
    pid:string;
    children?: Files[];
  }