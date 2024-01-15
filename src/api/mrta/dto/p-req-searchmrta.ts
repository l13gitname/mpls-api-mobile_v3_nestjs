import { ApiProperty } from "@nestjs/swagger";

export class PReqSearchmrta {
    @ApiProperty({
        type: String, default: `วรกุล`, description: `Customer Name`
    })
    customername: string
    @ApiProperty({
        type: String, default: `จันทะรังษี`, description: `Customer Surname`
    })
    customersname: string
    @ApiProperty({
        type: String, default: `3650200696547`, description: `CITICEN ID Card of customer`
    })
    idcardnum: string
    @ApiProperty({
        type: String, default: `0110202206010001`, description: `Application NO of Customer`
    })
    application_no: string
    @ApiProperty({
        type: String, default: `110202206010001`, description: `Contract No of customer`
    })
    contractno: string
    @ApiProperty({
        type: Number, default: 1, description: `Page Number of data in mrta Search result (items per page : 5,  default : 1)`
    })
    page_no: number
}
