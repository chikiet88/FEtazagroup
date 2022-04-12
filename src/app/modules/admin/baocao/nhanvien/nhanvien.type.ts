export class Nhanvien {
    id: string;
    SDT: string;
    name: string;
    email: string;
    password: string;
    avatar:string;
    profile: any;
    Ngaytao: Date;
    Role:string;
    Phanquyen:string;
    Menu:object;
}
export class profile {
    Congty: string;
    Khoi: string;
    Phongban: string;
    Bophan: string;
    Vitri: string;
    Vitri1: string;
    TTLV:number;
    MaNV: string;
    CMND: string;
    Datein: Date;
    Dateout: Date;
    Diachi: string;
    Fb: string;
    Gioitinh: number;
    Ngaysinh: any;
    PQDT: string[];
    PQTD: string[];
    Zalo: string;
}
export enum Role {
    Admin = 'admin',
    Manager = 'manager',
    User = 'user',
}