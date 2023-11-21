export interface IReqMplsCreateConsent {
    quotationid: string;
    consent_customer_name: string;
    consent_first_name: string;
    consent_last_name: string;
    is_credit_consent: number;
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
}

