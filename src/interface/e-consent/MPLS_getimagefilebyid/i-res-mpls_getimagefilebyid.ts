export interface IResMplsGetimagefilebyidData {
    image_id: string;
    image_name: string;
    image_type: string;
    image_code: string;
    image_file: {
        data: ArrayBuffer,
        type: string
    }
}

export interface IResMplsGetimagefilebyid {
    status: number;
    message: string;
    data: IResMplsGetimagefilebyidData[];
}
