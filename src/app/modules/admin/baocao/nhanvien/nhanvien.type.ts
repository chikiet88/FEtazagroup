export class Nhanvien {
    id: string;
    SDT: string;
    name: string;
    email: string;
    password: string;
    avatar:string;
    profile: profile;
    Ngaytao: Date;
    Role:string
}
export class profile {
    Congty: string;
    Khoi: string;
    Phongban: string;
    Bophan: string;
    Vitri: string;
    TTLV:number;
    MaNV: string;
    CMND: string;
    Datein: Date;
    Dateout: Date;
    Diachi: string;
    Fb: string;
    Gioitinh: number;
    Ngaysinh: Date;
    PQDT: string[];
    PQTD: string[];
    Zalo: string;
}
export enum Role {
    Admin = 'admin',
    Manager = 'manager',
    User = 'user',
}