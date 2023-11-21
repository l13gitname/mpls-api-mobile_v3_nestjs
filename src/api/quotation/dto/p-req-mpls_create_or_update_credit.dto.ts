import { ApiProperty } from "@nestjs/swagger";

export class ItemMplsCreateOrUpdateCredit {
    AAA: string
    @ApiProperty({
        type: String, default: ``, description: `AAA`
    })

    @ApiProperty({
        type: String, default: ``, description: `Quoataion ID`
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ``, description: `Brand Code`
    })
    brand_code: string
    @ApiProperty({
        type: String, default: ``, description: `Brand Name`
    })
    brand_name: string
    @ApiProperty({
        type: String, default: ``, description: `Model Code`
    })
    model_code: string
    @ApiProperty({
        type: String, default: ``, description: `Model Name`
    })
    model_name: string
    @ApiProperty({
        type: String, default: ``, description: `Color Name`
    })
    color_name: string
    @ApiProperty({
        type: String, default: ``, description: `Loan Amount`
    })
    loan_amount: number | null
    @ApiProperty({
        type: String, default: ``, description: `Product Value`
    })
    product_value: number | null
    @ApiProperty({
        type: String, default: ``, description: `Interest Rate`
    })
    interest_rate: number | null
    @ApiProperty({
        type: String, default: ``, description: `Payment Value`
    })
    payment_value: number | null
    @ApiProperty({
        type: String, default: ``, description: `Payment Round Count`
    })
    payment_round_count: number | null
    @ApiProperty({
        type: String, default: ``, description: `Insurance Code (รหัสประกัน)`
    })
    insurance_code: string
    @ApiProperty({
        type: String, default: ``, description: `Insurance Name`
    })
    insurance_name: string
    @ApiProperty({
        type: String, default: ``, description: `Insurance Year`
    })
    insurance_year: number | null
    @ApiProperty({
        type: String, default: ``, description: `Insurance Plan Price`
    })
    insurance_plan_price: number | null
    @ApiProperty({
        type: String, default: ``, description: `Is Include Loanamoont`
    })
    is_include_loanamount: number | null
    @ApiProperty({
        type: String, default: ``, description: `Factory Price`
    })
    factory_price: number | null
    @ApiProperty({
        type: String, default: ``, description: `Size Model`
    })
    size_model: string
    @ApiProperty({
        type: String, default: ``, description: `Insurer Code (รหัสบริษัทประกัน)`
    })
    insurer_code: string
    @ApiProperty({
        type: String, default: ``, description: `Insurer Code`
    })
    insurer_name: string
    @ApiProperty({
        type: String, default: ``, description: `Coverage TotalLoss`
    })
    coverage_total_loss: number | null
    @ApiProperty({
        type: String, default: ``, description: `Max LTV`
    })
    max_ltv: number | null
    @ApiProperty({
        type: String, default: ``, description: `Price Including Vat value`
    })
    price_include_vat: number | null
    @ApiProperty({
        type: String, default: ``, description: `Engine Number`
    })
    engine_number: string
    @ApiProperty({
        type: String, default: ``, description: `Chassic Number`
    })
    chassis_number: string
    @ApiProperty({
        type: String, default: ``, description: `Running Engine Number`
    })
    engine_no_running: string
    @ApiProperty({
        type: String, default: ``, description: `Running Chassic Number`
    })
    chassis_no_running: string
    @ApiProperty({
        type: String, default: ``, description: `Dealer Code`
    })
    dealer_code: string
    @ApiProperty({
        type: String, default: ``, description: `Checker ID`
    })
    checker_id: string

    @ApiProperty({
        type: String, default: ``, description: `Bussiness Code`
    })
    bussiness_code: string
    @ApiProperty({
        type: String, default: ``, description: `Business Name`
    })
    bussiness_name: string
    @ApiProperty({
        type: String, default: ``, description: `Model Year`
    })
    model_year: string
    @ApiProperty({
        type: String, default: ``, description: `CC`
    })
    cc: number | null
    @ApiProperty({
        type: String, default: ``, description: `Register number`
    })
    reg_no: string
    @ApiProperty({
        type: String, default: ``, description: `Register Date`
    })
    reg_date: string
    @ApiProperty({
        type: String, default: ``, description: `Contract Reference Number`
    })
    contract_ref: string
    @ApiProperty({
        type: String, default: ``, description: `Register Mile`
    })
    reg_mile: number | null
    @ApiProperty({
        type: String, default: ``, description: `Province Code`
    })
    prov_code: string
    @ApiProperty({
        type: String, default: ``, description: `Province Name`
    })
    prov_name: string
    @ApiProperty({
        type: String, default: ``, description: `Motorcycle Year`
    })
    moto_year: number | null
    @ApiProperty({
        type: String, default: ``, description: `Motocycle Grade`
    })
    grade_moto: string
    @ApiProperty({
        type: String, default: ``, description: `Is Over Max LTV`
    })
    is_over_max_ltv: string
    @ApiProperty({
        type: String, default: ``, description: `Over Max LTV Reason`
    })
    over_max_ltv_reason: string
    @ApiProperty({
        type: String, default: ``, description: `Motor Number`
    })
    motor_number: string
}

export class PReqMplsCreateOrUpdateCredit {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    image_file: any[];
    @ApiProperty({ type: ItemMplsCreateOrUpdateCredit, description: `item` })
    item: ItemMplsCreateOrUpdateCredit
}
