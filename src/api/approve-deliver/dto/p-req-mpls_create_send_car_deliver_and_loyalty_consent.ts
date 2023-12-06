import { ApiProperty } from "@nestjs/swagger";

export class ItemMplsCreateSendCarDeliverAndLoyaltyConsent {
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_sale_sheet_explain: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_product_detail: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_payment_rule: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_contract_explain: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_total_loss_explain: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_check_total_loss_company: number | null
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    lalon: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    latitude: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    londtiude: string
}

export class PReqMplsCreateSendCarDeliverAndLoyaltyConsent {
    @ApiProperty({ type: 'string', format: 'binary', name: 'firstImage' })
    firstImage: any;
    @ApiProperty({ type: 'string', format: 'binary', name: 'dealerSign' })
    dealerSign: any;
    @ApiProperty({ type: 'string', default: ``, description: `` })
    dealername: string
    @ApiProperty({ type: 'string', default: ``, description: `` })
    quotationid: string
    @ApiProperty({ type: ItemMplsCreateSendCarDeliverAndLoyaltyConsent, description: `item` })
    loyaltyitem: ItemMplsCreateSendCarDeliverAndLoyaltyConsent
}