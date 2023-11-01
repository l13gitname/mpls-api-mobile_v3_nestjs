

export interface IResUserData {
    USERID: string;
    USERNAME: string;
    FNAME: string;
    LNAME: string;
    EMAIL: string;
    RADMIN?: any;
    STATUS: string;
    EXPIRE_DATE: string;
    channal: string;
    FULLNAME: string;
    ID: string;
    SELLER_ID: string;
    ROLE: string;
}

export interface IResUser {
    token: string;
    data: IResUserData;
    status: number;
    message: string;
} 