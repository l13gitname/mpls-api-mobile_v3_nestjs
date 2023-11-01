export interface IResUserV2Data {
    userid: string;
    username: string;
    fname: string;
    lname: string;
    email: string;
    radmin?: any;
    status: string;
    expire_date: string;
}

export interface IResUserV2 {
    status: number;
    message: string;
    data: IResUserV2Data;
    token: string;
}


