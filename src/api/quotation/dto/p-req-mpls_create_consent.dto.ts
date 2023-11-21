import { ApiProperty } from "@nestjs/swagger";

export class ItemMplsCreateConsent {
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    consent_customer_name: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    consent_first_name: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    consent_last_name: string
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    is_credit_consent: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    identity_approve_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    motor_insurance_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    nmotor_insurance_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    analyze_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    info_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    info_party_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    analyze_party_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    prdt_info_party_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    followup_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    info_develop_consent_value: number
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    e_paper_consent_value: number

}

export class PReqMplsCreateConsent {
    @ApiProperty({ type: 'string', format: 'binary', name: 'signature_image' })
    signature_image: any;
    @ApiProperty({ type: 'string', format: 'binary', name: 'witness_image' })
    witness_image: any;
    @ApiProperty({ type: ItemMplsCreateConsent, description: `item` })
    item: ItemMplsCreateConsent
}