import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCreateOrUpdateCitizendata {

    @ApiProperty({ type: String, default: '', description: 'QuotationID' })
    quotationid: string;

    @ApiProperty({ type: Number, default: '', description: `Age` })
    age: string | number;
    @ApiProperty({ type: String, default: '', description: `Title Code` })
    titleCode: string;
    @ApiProperty({ type: String, default: '', description: `Title Name` })
    titleName: string;
    @ApiProperty({ type: String, default: '', description: `Firstname` })
    firstName: string;
    @ApiProperty({ type: String, default: '', description: `Lastname` })
    lastName: string;
    @ApiProperty({ type: String, default: '', description: `Gender` })
    gender: string | number;
    @ApiProperty({ type: String, default: '', description: `CITIZEN ID-CARD Number` })
    citizenId: string;
    @ApiProperty({ type: String, default: '', description: `Birthdate` })
    birthDate: string;
    @ApiProperty({ type: String, default: '', description: `Issue Date` })
    issueDate: string;
    @ApiProperty({ type: String, default: '', description: `Expire Date` })
    expireDate: string;
    @ApiProperty({ type: String, default: '', description: `Issue Place` })
    issuePlace: string;

    @ApiProperty({ type: String, default: '', description: `Email` })
    email: string;
    @ApiProperty({ type: String, default: '', description: `Phone Number` })
    phone_number: string;
    @ApiProperty({ type: String, default: '', description: `Nickname` })
    nick_name: string;
    @ApiProperty({ type: String, default: '', description: `Maried Status` })
    maried_status: string | number;
    @ApiProperty({ type: String, default: '', description: `House Type` })
    house_type: string | number;
    @ApiProperty({ type: String, default: '', description: `Stayed Month` })
    stayed_month: number;
    @ApiProperty({ type: String, default: '', description: `Stayed Year` })
    stayed_year: number;
    @ApiProperty({ type: String, default: '', description: `House Owner Type` })
    house_owner_type: string | number;

    @ApiProperty({ type: String, default: '', description: `Address` })
    address: string;
    @ApiProperty({ type: String, default: '', description: `Sub-District` })
    subDistrict: string;
    @ApiProperty({ type: String, default: '', description: `District` })
    district: string;
    @ApiProperty({ type: String, default: '', description: `Province Code` })
    provinceCode: string;
    @ApiProperty({ type: String, default: '', description: `Province Name` })
    provinceName: string;
    @ApiProperty({ type: String, default: '', description: `Postal Code` })
    postalCode: string;
    @ApiProperty({ type: String, default: '', description: `CIZCARD IMAGE (BASE64)` })
    cizcardImage: string;

    @ApiProperty({ type: String, default: '', description: `Living Address` })
    liv_address: string;
    @ApiProperty({ type: String, default: '', description: `Living Sub-District` })
    liv_sub_district: string;
    @ApiProperty({ type: String, default: '', description: `Living District` })
    liv_district: string;
    @ApiProperty({ type: String, default: '', description: `Living Province Code` })
    liv_province_code: string;
    @ApiProperty({ type: String, default: '', description: `Living Province Name` })
    liv_province_name: string;
    @ApiProperty({ type: String, default: '', description: `Living Postal Code` })
    liv_postal_code: string;
    @ApiProperty({ type: String, default: '', description: `Living Latitude` })
    liv_la: string;
    @ApiProperty({ type: String, default: '', description: `Living Longtitude` })
    liv_lon: string;
    @ApiProperty({ type: String, default: '', description: `Living Latitude-Longitude` })
    liv_lalon: string;

    @ApiProperty({ type: String, default: '', description: `Contact Address` })
    cont_address: string;
    @ApiProperty({ type: String, default: '', description: `Contact Sub-District` })
    cont_sub_district: string;
    @ApiProperty({ type: String, default: '', description: `Contact District` })
    cont_district: string;
    @ApiProperty({ type: String, default: '', description: `Contact Province Code` })
    cont_province_code: string;
    @ApiProperty({ type: String, default: '', description: `Contact Province Name` })
    cont_province_name: string;
    @ApiProperty({ type: String, default: '', description: `Contact Postal Code` })
    cont_postal_code: string;

    @ApiProperty({ type: String, default: '', description: `House Register Place Address` })
    hrp_address: string;
    @ApiProperty({ type: String, default: '', description: `House Register Place Sub-District` })
    hrp_sub_district: string;
    @ApiProperty({ type: String, default: '', description: `House Register Place District` })
    hrp_district: string;
    @ApiProperty({ type: String, default: '', description: `House Register Place Province Code` })
    hrp_province_code: string;
    @ApiProperty({ type: String, default: '', description: `House Register Place Province Name` })
    hrp_province_name: string;
    @ApiProperty({ type: String, default: '', description: `House Register Place Postal Code` })
    hrp_postal_code: string;

    @ApiProperty({ type: String, default: '', description: `Workplace Address` })
    work_address: string;
    @ApiProperty({ type: String, default: '', description: `Workplace Sub-District` })
    work_sub_district: string;
    @ApiProperty({ type: String, default: '', description: `Workplace District` })
    work_district: string;
    @ApiProperty({ type: String, default: '', description: `Workplace Province Code` })
    work_province_code: string;
    @ApiProperty({ type: String, default: '', description: `Workplace Province Name` })
    work_province_name: string;
    @ApiProperty({ type: String, default: '', description: `Workplace Postal Code` })
    work_postal_code: string;
    @ApiProperty({ type: String, default: '', description: `DIPCHIP_UUID (ไม่รองรับ ไม่ต้องใส่มา)` })
    dipchipuuid: string;
    @ApiProperty({ type: String, default: '', description: `Workplace Description` })
    work_description: string;

}
