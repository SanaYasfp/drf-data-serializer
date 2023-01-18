import { Fields } from "../types";

export function init_object_property(obj: { [x: string]: any }, key: keyof typeof obj, defaultValue: any = []) {
    obj[key] = obj[key] ? obj[key] : defaultValue;
}

export function error_messages(fieldType: Fields): string {
    switch (fieldType) {
        case "CharField":
            return ("Must be a string !");
        case "EmailField":
            return ("Invalid email address !");
        case "RegexField":
            return ("Did not match the regular expression !");
        case "IntegerField":
            return ("Must be an integer !");
        case "FloatField":
            return ("Must be a floating number !");
        case "DateTimeField":
            return ("Did not a valid date and time !");
        case "DateField":
            return ("Did not a valid date !");
        case "TimeField":
            return ("Did not a valid time !");
        default: return ("Value error !");
    }
}
