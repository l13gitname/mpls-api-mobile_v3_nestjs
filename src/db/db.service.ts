import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
@Injectable()
export class DbService {

    constructor(
        private configService: ConfigService,
    ) {
        /*.... intialize variable here ...*/
    }

    async ConnectionDB(): Promise<[oracledb.Connection, oracledb.DBError]> {
        try {

            /*... call oracledb init on oracledb ...*/
            let connectdb = oracledb
            connectdb.initOracleClient()
            connectdb.fetchAsString = []

            const dbconnect = await connectdb.getConnection({
                user: this.configService.get<string>('DB_APIUSER'),
                password: this.configService.get<string>('DB_PASSWORD'),
                connectionString: this.configService.get<string>('DB_CONNECTSTR')
            });
            return [dbconnect, null];
        } catch (e) {
            return [null, e]
        }
    }

    async ConnectionDBbuffer(): Promise<[oracledb.Connection, oracledb.DBError]> {
        try {

            /*... call oracledb init on oracledb ...*/
            let connectdb = oracledb
            connectdb.initOracleClient()
            connectdb.fetchAsBuffer = [oracledb.BLOB]


            const dbconnect = await connectdb.getConnection({
                user: this.configService.get<string>('DB_APIUSER'),
                password: this.configService.get<string>('DB_PASSWORD'),
                connectionString: this.configService.get<string>('DB_CONNECTSTR')

            });

            return [dbconnect, null];
        } catch (e) {
            return [null, e]
        }
    }


    doRelease(connection: oracledb.Connection) {
        connection.close((err) => {
            if (err)
                console.error(err.message);
            console.log('connection close');
        });
    }

    async internal_execute(executequery: string) {


        let dbconnect = await this.ConnectionDB()
        try {
            if (dbconnect) {
                if (dbconnect[0]) {
                    const result = await dbconnect[0].execute(`
                    ${executequery}
                `, {}, { outFormat: 4002 })

                    return result
                } else {
                    if (dbconnect[1]) {
                        throw new Error(`can't connect database oracle : Fail`);
                    } else {
                        throw new Error(`can't connect database oracle : Fail`);
                    }
                }
            }
        } catch (e) {
            0
            throw new Error(`Error executing query: ${e.message}`);
        } finally {
            if (dbconnect) {
                if (dbconnect[0]) {
                    try {
                        await dbconnect[0].close();
                    } catch (e) {
                        throw new Error(`Error : message : ${e.message ? e.message : 'No return message'}`);
                    }
                }
            }
        }
    }

    async internal_executebinding(executequery: string, bindparam: oracledb.BindParameters) {

        let dbconnect = await this.ConnectionDB()
        try {
            if (dbconnect) {
                if (dbconnect[0]) {
                    const result = await dbconnect[0].execute(`
                        ${executequery}
                    `, bindparam, { outFormat: 4002 })

                    return result
                } else {
                    if (dbconnect[1]) {

                        throw new Error(`can't connect database oracle : ${dbconnect[1].message ? dbconnect[1].message : 'No return message inside DBError return'}`)
                    } else {

                        throw new Error(`Fail : can't connect database oracle`)
                    }
                }
            } else {
                throw new Error(`can't connect database oracle : Fail`);
            }
        } catch (e) {
            throw new Error(`Error executing query: ${e.message}`);
        } finally {
            if (dbconnect) {
                if (dbconnect[0]) {
                    try {
                        await dbconnect[0].close();
                    } catch (e) {
                        throw new Error(`Error : message : ${e.message ? e.message : 'No return message'}`);
                    }
                }
            }
        }
    }
}
