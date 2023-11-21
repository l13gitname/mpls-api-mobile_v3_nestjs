import { ApiProperty } from "@nestjs/swagger";

export class ItemDipchip {
    @ApiProperty({ type: Number, default: '', description: `Age` })
    age: number;
    @ApiProperty({ type: String, default: '', description: `Title Code` })
    titleCode: string;
    @ApiProperty({ type: String, default: '', description: `Title Name` })
    titleName: string;
    @ApiProperty({ type: String, default: '', description: `FIrstname` })
    firstName: string;
    @ApiProperty({ type: String, default: '', description: `Lastname` })
    lastName: string;
    @ApiProperty({ type: Number, default: '', description: `Gender` })
    gender: number;
    @ApiProperty({ type: String, default: '', description: `CITTIZEN IDCARD Number` })
    citizenId: string;
    @ApiProperty({ type: String, default: '', description: `Birthdate` })
    birthDate: string;
    @ApiProperty({ type: String, default: '', description: `Issue Date` })
    issueDate: string;
    @ApiProperty({ type: String, default: '', description: `Expire Date` })
    expireData: string;
    @ApiProperty({ type: String, default: '', description: `Issue Place` })
    issuePlace: string;
    @ApiProperty({ type: String, default: '', description: `Address` })
    address: string;
    @ApiProperty({ type: String, default: '', description: `Sub District` })
    subDistrict: string;
    @ApiProperty({ type: String, default: '', description: `District` })
    district: string;
    @ApiProperty({ type: String, default: '', description: `Province Name` })
    provinceName: string;
    @ApiProperty({ type: String, default: '', description: `Provice Code` })
    provinceCode: string;
    @ApiProperty({ type: String, default: '', description: `Postal Code` })
    postalCode: string;
    @ApiProperty({ type: String, default: '', description: `Cizcard Image` })
    cizcardImage: string;
    @ApiProperty({ type: String, default: '', description: `DIPCHIP UUID` })
    dipchipuuid: string;

}

export class PReqMplsDipchip {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    image_file: any[];
    @ApiProperty({ type: ItemDipchip, description: `item` })
    item: ItemDipchip
}
