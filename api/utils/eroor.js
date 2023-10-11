import { error } from "console"

export const errorhandler = (statusCode, message)=>{
    const error = new Error()
    error.statusCode =statusCode
    error.message = message
    return error
}