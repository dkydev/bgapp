import * as mongoose from "mongoose";

(<any>mongoose).Promise = require("bluebird");

export function dbInit() {

    const dbAddress = process.env.DB_HOST || "127.0.0.1";
    const dbName = process.env.DB_NAME;
//const dbPort = process.env.DB_PORT || 27017;
    const dbQueryString = process.env.DB_QUERYSTRING || "";
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
//export const dbURI = `mongodb://${dbAddress}:${dbPort}/${dbName}`;
//export const dbURI = process.env.DB_CONNECTION_STRING;

    let uri: string = `mongodb://${dbUser}:${dbPass}@${dbAddress}/${dbName}${dbQueryString}`;
    mongoose.connect(uri).catch(err => {
        if (err.message.indexOf("ECONNREFUSED") !== -1) {
            console.error("Error: The server was not able to reach MongoDB. Maybe it's not running?");
            process.exit(1);
        } else {
            throw err;
        }
    });

}

export function dbClose(): Promise<void> {
    return new Promise((resolve, reject) => {
        mongoose.disconnect(error => {
            if (error) reject(error);
            resolve();
        })
    });
}