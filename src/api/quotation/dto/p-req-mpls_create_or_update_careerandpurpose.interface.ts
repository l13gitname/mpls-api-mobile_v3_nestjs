import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCreateOrUpdateCareerandpurpose {
    /* ... Career Path ... */
    @ApiProperty({
        type: String, default: ``, description: `aaa`
    })
    aaa: string;

    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string;
    @ApiProperty({
        type: String, default: ``, description: `อาชีพหลัก (code) (select list; exc. 100, 200, ... 800)`
    })
    main_career_code: string;
    @ApiProperty({
        type: String, default: ``, description: `อาชีพหลัก (name) (nouse)`
    })
    main_career_name: string;
    @ApiProperty({
        type: String, default: ``, description: `แผนก/ฝ่าย/สังกัด/กรม/กอง`
    })
    main_department: string;
    @ApiProperty({
        type: Number, default: null, description: `อายุงาน (เดือน)`
    })
    main_experience_month: number | null;
    @ApiProperty({
        type: Number, default: null, description: `อายุงาน (ปี)`
    })
    main_experience_year: number | null;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อหัวหน้างาน`
    })
    main_leader_name: string;
    @ApiProperty({
        type: String, default: ``, description: `ตำแหน่งงาน`
    })
    main_position: string;
    @ApiProperty({
        type: Number, default: null, description: `รายได้ต่อวัน`
    })
    main_salary_per_day: number | null;
    @ApiProperty({
        type: Number, default: null, description: `รายได้ต่อเดือน`
    })
    main_salary_per_month: number | null;
    @ApiProperty({
        type: Number, default: null, description: `ทำงาน (วัน/เดือน)`
    })
    main_work_per_week: number | null;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อสถานที่ทำงาน`
    })
    main_workplace_name: string;
    @ApiProperty({
        type: String, default: ``, description: `เบอร์โทรศัพท์ที่ทำงาน (เบอร์ 1)`
    })
    main_workplace_phone_no_1: string;
    @ApiProperty({
        type: String, default: ``, description: `เบอร์โทรศัพท์ที่ทำงาน (เบอร์ 2)`
    })
    main_workplace_phone_no_2: string;
    @ApiProperty({
        type: String, default: ``, description: `อาชีพรอง (มี/ไม่มี value 1 : 0)`
    })
    is_sub_career: string;
    @ApiProperty({
        type: String, default: ``, description: `อาชีพรอง (code) (select list; exc. 100, 200, ... 800) `
    })
    sub_career_code: string;
    @ApiProperty({
        type: String, default: ``, description: `อาชีพรอง (name) (nouse)`
    })
    sub_career_name: string;
    @ApiProperty({
        type: String, default: ``, description: `แผนก/ฝ่าย/สังกัด/กรม/กอง (อาชีพรอง)`
    })
    sub_department: string;
    @ApiProperty({
        type: Number, default: null, description: `อายุงาน (เดือน) (อาชีพรอง)`
    })
    sub_experience_month: number | null;
    @ApiProperty({
        type: Number, default: null, description: `อายุงาน (ปี) (อาชีพรอง)`
    })
    sub_experience_year: number | null;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อหัวหน้างาน (อาชีพรอง)`
    })
    sub_leader_name: string;
    @ApiProperty({
        type: String, default: ``, description: `ตำแหน่งงาน (อาชีพรอง)`
    })
    sub_position: string;
    @ApiProperty({
        type: Number, default: null, description: `รายได้ต่อวัน (อาชีพรอง)`
    })
    sub_salary_per_day: number | null;
    @ApiProperty({
        type: Number, default: null, description: `รายได้ต่อเดือน (อาชีพรอง)`
    })
    sub_salary_per_month: number | null;
    @ApiProperty({
        type: Number, default: null, description: `ทำงาน (วัน/เดือน) (อาชีพรอง)`
    })
    sub_work_per_week: number | null;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อสถานที่ทำงาน (อาชีพรอง)`
    })
    sub_workplace_name: string;

    /* ... Purpose Path ... */

    @ApiProperty({
        type: String, default: ``, description: `ชื่อผู้ใช้รถ`
    })
    car_user: string;
    @ApiProperty({
        type: String, default: ``, description: `เลบัตรประจำตัวผู้ใช้รถ`
    })
    car_user_citizen_id: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่อำเภอผู้ใช้รถ`
    })
    car_user_district: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ชั้นผู้ใช้รถ`
    })
    car_user_floor: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ชื่อบ้านผู้ใช้รถ`
    })
    car_user_home_name: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่บ้านเลขที่ผู้ใช้รถ`
    })
    car_user_home_no: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่หมู่ผู้ใช้รถ`
    })
    car_user_moo: string;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อผู้ใช้รถ`
    })
    car_user_name: string;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อผู้ใช้รถ (2)`
    })
    car_user_name_2: string;
    @ApiProperty({
        type: String, default: ``, description: `เบอร์โทรศัพท์ผู้ใช้รถ`
    })
    car_user_phone_no: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่รหัสไปรษณีย์ผู้ใช้รถ`
    })
    car_user_postal_code: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่รหัสจังหวัดผู้ใช้รถ`
    })
    car_user_province_code: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่จังหวัดผู้ใช้รถ`
    })
    acar_user_province_nameaa: string;
    @ApiProperty({
        type: String, default: ``, description: `ความสัมพันธ์กับผู้ใช้รถ`
    })
    car_user_relation: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ถนนผู้ใช้รถ`
    })
    car_user_road: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ห้องเลขที่ผู้ใช้รถ`
    })
    car_user_room_no: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ซอยผู้ใช้รถ`
    })
    car_user_soi: string;
    @ApiProperty({
        type: String, default: ``, description: `ที่อยู่ตำบลผู้ใช้รถ`
    })
    car_user_sub_district: string;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อบุคคลอ้างอิง 1`
    })
    first_referral_fullname: string;
    @ApiProperty({
        type: String, default: ``, description: `เบอร์บุคคลอ้างอิง 1`
    })
    first_referral_phone_no: string;
    @ApiProperty({
        type: String, default: ``, description: `วัตถุประสงค์การเช่าซื้อ 1`
    })
    purpose_buy: string;
    @ApiProperty({
        type: String, default: ``, description: `ความสัมพันธ์ (บุคคลอ้างอิง 1)`
    })
    first_referral_relation: string;
    @ApiProperty({
        type: String, default: ``, description: `ผู้ถูกซื้อแทน`
    })
    purpose_buy_name: string;
    @ApiProperty({
        type: String, default: ``, description: `เหตุผลในการออกรถ`
    })
    reason_buy: string;
    @ApiProperty({
        type: String, default: ``, description: `โปรดระบุเหตุผล (select List)`
    })
    reason_buy_etc: string;
    @ApiProperty({
        type: String, default: ``, description: `ชื่อบุคคลอ้างอิง 2`
    })
    second_referral_fullname: string;
    @ApiProperty({
        type: String, default: ``, description: `เบอร์บุคคลอ้างอิง 2`
    })
    second_referral_phone_no: string;
    @ApiProperty({
        type: String, default: ``, description: `ความสัมพันธ์ (บุคคลอ้างอิง 2)`
    })
    second_referral_relation: string;

}