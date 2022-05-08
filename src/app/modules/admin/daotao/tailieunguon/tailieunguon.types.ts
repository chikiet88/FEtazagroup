export interface Files {
    item: string;
    id:number;
    type:string;
    parentid:number;
    children?: Files[];
  }