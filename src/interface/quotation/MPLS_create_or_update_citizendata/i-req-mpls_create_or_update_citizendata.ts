export interface IReqMplsCreateOrUpdateCitizendata {
    quotationid: string;
    age: string | number;
    titleCode: string;
    titleName: string;
    firstName: string;
    lastName: string;
    gender: string | number;
    citizenId: string;
    birthDate: string;
    issueDate: string;
    expireDate: string;
    issuePlace: string;
    email: string;
    phone_number: string;
    nick_name: string;
    maried_status: string | number;
    house_type: string | number;
    stayed_month: number;
    stayed_year: number;
    house_owner_type: string | number;
    address: string;
    subDistrict: string;
    district: string;
    provinceCode: string;
    provinceName: string;
    postalCode: string;
    cizcardImage: string;
    liv_address: string;
    liv_sub_district: string;
    liv_district: string;
    liv_province_code: string;
    liv_province_name: string;
    liv_postal_code: string;
    liv_la: string;
    liv_lon: string;
    liv_lalon: string;
    cont_address: string;
    cont_sub_district: string;
    cont_district: string;
    cont_province_code: string;
    cont_province_name: string;
    cont_postal_code: string;
    hrp_address: string;
    hrp_sub_district: string;
    hrp_district: string;
    hrp_province_code: string;
    hrp_province_name: string;
    hrp_postal_code: string;
    work_address: string;
    work_sub_district: string;
    work_district: string;
    work_province_code: string;
    work_province_name: string;
    work_postal_code: string;
    dipchipuuid: string;
    work_description: string;
}
