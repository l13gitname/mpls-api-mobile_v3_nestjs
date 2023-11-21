import { ApiProperty } from "@nestjs/swagger";

export class PReqGetquotationlist {

        @ApiProperty({
                default: 1, description: `page number of datalist`
        })
        pageno: number

        @ApiProperty({
                default: ``, description: `status of quotation`
        })
        status: string

        @ApiProperty({
                default: ``, description: `filter search by name`
        })
        searchname: string;

        @ApiProperty({
                default: ``, description: `filter search Citizen ID card`
        })
        searchidcardnum: string;

        @ApiProperty({
                default: ``, description: `filter search reference pay number (refpaynum)`
        })
        searchrefpaynum: string;

        @ApiProperty({
                default: ``, description: `filter search pay status`
        })
        searchpaystatus: string;
}
