export class Nhanvien {
    id: string;
    SDT: string;
    name: string;
    email: string;
    password: string;
    avatar:string;
    profile: string;
    Ngaytao: Date;
    Role:string;
    Phanquyen:string;
    Menu:object;
    Trangthai:number;
}
export class profile {
    id: string;
    idUser: string;
    Congty: string;
    Khoi: string;
    Phongban: string;
    Vitri: string;
    MaNV: string;
    CMND: Number;
    Ngayvao: Date;
    Ngaynghi: Date;
    Diachi: string;
    Facebook: string;
    Ngaysinh: Date;
    Zalo: string;
    Trangthai: number;
    Ngaytao: Date;
    idTao: string;
}
export enum Role {
    Admin = 'admin',
    Manager = 'manager',
    User = 'user',
}