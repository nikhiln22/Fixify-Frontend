
export interface Iuser {
    username: string;
    email: string;
    password: string;
    phone: number;
    status: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}