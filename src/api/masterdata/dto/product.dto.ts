export interface IbranchData {
    branch_code: string;
    branch_name: string;
}

export interface Ibranch {
    status: number;
    message: string;
    data: IbranchData[];
}

