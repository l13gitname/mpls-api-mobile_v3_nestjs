export interface IResMastermrta {
    status: number
    message: string
    data: IResMastermrtaData[]
  }
  
  export interface IResMastermrtaData {
    insurer_code: string
    insurance_code: string
    plan: string
  }
  