export interface IExecMplsconsentbyidexec {
    id: number;
    app_key_id: string;
    cons_quo_key_app_id: string;
    customer_name: string;
    frist_name: string;
    last_name: string;
    is_credit_consent: number;
    created_time: Date;
    identity_approve_consent_value: number;
    motor_insurance_consent_value: number;
    nmotor_insurance_consent_value: number;
    analyze_consent_value: number;
    info_consent_value: number;
    info_party_consent_value: number;
    analyze_party_consent_value: number;
    prdt_info_party_consent_value: number;
    followup_consent_value: number;
    info_develop_consent_value: number;
    e_paper_consent_value: number;
    verify_status: string;
    verify_by: string;
    verify_datetime: Date;
    witness_image: {
        data: ArrayBuffer,
        type: string
    },
    signature_image: {
        data: ArrayBuffer,
        type: string
    }
}

