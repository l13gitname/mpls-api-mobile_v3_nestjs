export interface IExecCheckusertypeexec {
    userid: string
    username: string
    fname: string
    lname: string
    email: string
    radmin: string
    status: string
    seller_id: string;
    expire_date: Date | null
    checker_code: string
    witness_name: string
    witness_lname: string
    witness_title_name: string
    channal_type: 'CHECKER' | 'DEALER'
}
