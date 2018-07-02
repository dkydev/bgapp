import * as mongoose from "mongoose";

(<any>mongoose).Promise = require("bluebird");

const dbAddress = process.env.DB_HOST || "127.0.0.1";
//const dbPort = process.env.DB_PORT || 27017;
const dbQueryString = process.env.DB_QUERYSTRING || "";
//export const dbURI = `mongodb://${dbAddress}:${dbPort}/${dbName}`;
//export const dbURI = process.env.DB_CONNECTION_STRING;

export var dbOptions = {};

if (process.env.DB_AUTH === "true") {
    dbOptions["user"] = process.env.DB_USER;
    dbOptions["pass"] = process.env.DB_PASS;
}

export function dbInit(dbName:string) {

    let uri:string = `mongodb://${dbAddress}/${dbName}${dbQueryString}`;
    mongoose.connect(uri, dbOptions).catch(err => {
        if (err.message.indexOf("ECONNREFUSED") !== -1) {
            console.error("Error: The server was not able to reach MongoDB. Maybe it's not running?");
            process.exit(1);
        } else {
            throw err;
        }
    });

}