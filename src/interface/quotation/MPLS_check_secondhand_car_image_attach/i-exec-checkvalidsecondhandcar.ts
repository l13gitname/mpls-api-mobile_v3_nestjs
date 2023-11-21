export interface IExecCheckvalidsecondhandcar {
    // SELECT MPC.CRE_QUO_KEY_APP_ID AS QUOTATIONID, MPC.APP_KEY_ID AS CREDITID, MPI.VALID_FIELD
    cre_quo_key_app_id: string;
    quotationid: string;
    creditid: string;
    valid_field: 'Y' | 'N';
}
