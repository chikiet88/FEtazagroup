export interface Duan
{
    id: string;
    Tieude: string;
    Mota: string;
    Tomtat: string;
    Deadline: Date;
    Thamgia: string[];
    Noibat:boolean;
    Ordering:number;
    Trangthai:number;
    selectedIndex:number;
    Ngaytao:Date;
    idTao:string;   
}
export interface Task
{
    id: string;
    sid: string;
    gid: string;
    Tieude: string;
    Mota: string;
    Batdau: Date;
    Ketthuc: Date;
    Deadline: Date;
    Thuchien: string;
    Uutien:number;
    Trangthai:number;
    Ngaytao:Date;
    idTao:string;    
}

export interface Contact
{
    id?: string;
    avatar?: string;
    name?: string;
    about?: string;
    details?: {
        emails?: {
            email?: string;
            label?: string;
        }[];
        phoneNumbers?: {
            country?: string;
            phoneNumber?: string;
            label?: string;
        }[];
        title?: string;
        company?: string;
        birthday?: string;
        address?: string;
    };
    attachments?: {
        media?: any[];
        docs?: any[];
        links?: any[];
    };
}

export interface Chat
{
    id?: string;
    contactId?: string;
    contact?: Contact;
    unreadCount?: number;
    muted?: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: {
        id?: string;
        chatId?: string;
        contactId?: string;
        isMine?: boolean;
        value?: string;
        createdAt?: string;
    }[];
}
