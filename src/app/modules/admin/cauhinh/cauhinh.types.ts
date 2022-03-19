export interface Cauhinh {
    id?:string
    title?:string
    detail?:object
    Trangthai?:number
    Ordering?:number
    Ngaytao?:Date
    idTao?:string
}
export interface Menu {
    uuid:string
    id:string
    title:string
    type:string
    icon:string
    link:string
    level:number
    parent:[]
    status:boolean
    Ngaytao:Date
    idTao:string
}