export interface IResSmssuccess {
    bad_phone_number_list: {
        message: string
        number: string
    },
    credit_type: string,
    phone_number_list: {
        message_id: string
        number: string
        used_credit: number
    },
    remaining_credit: number,
    total_use_credit: number
}
