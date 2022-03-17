export interface User
{
    id: string;
    name: string;
    SDT: string;
    hinhanh: string;
    status: string;
    username: string;
    email: string;
    Role:string;
    Phanquyen:Phanquyen;
}
export interface Phanquyen
{
    Chinhanh: string;
}