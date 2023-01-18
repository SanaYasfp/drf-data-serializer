import { Fields } from "../types";
import AcceptedField from "./AcceptedField";

class Validator extends AcceptedField {

    protected validator!: { [x: string]: any; };

    constructor(validator: { [x: string]: any; }) {
        super();
        this.validator = validator;
    }

    static GetUnknownField(rightObj: object, leftObj: object) {
        const rightFields = Object.keys(rightObj);
        const leftFields = Object.keys(leftObj);
        return leftFields.filter(field => !rightFields.includes(field));
    }

    static Is({ fieldType, value }: { fieldType: Fields, value: any }, cb?: (result: boolean) => any) {
        const result: boolean = Validator.prototype[fieldType](value);
        return cb !== undefined ? cb(result) : result;
    }

    CharField(value: any): boolean {
        return typeof value === 'string';
    }

    EmailField(value: any): boolean {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
    }

    RegexField(value: any): boolean {
        return true;
    }

    IntegerField(value: any): boolean {
        if (typeof value !== 'number') return false;

        const part = String(value).split('.');
        if (part.length > 1) return false;

        return true;
    }

    FloatField(value: any): boolean {
        if (typeof value !== 'number') return false;

        const part = String(value).split('.');
        if (part.length > 2) return false;

        return true;
    }

    DateTimeField(value: any): boolean {
        try {
            // Accept date before 01 january 1970
            // const date = new Date(value);
            // return !Number.isNaN(Date.parse(date));

            // Only accept date after 01 january 1970
            return (new Date(value)).getTime() > 0;
        } catch (e) {
            return false;
        }
    }

    DateField(value: any): boolean {
        const part = value.split('-');
        if (part.length > 3) return false;

        const [year, month, day] = part;

        if (year.length !== 4 && !this.IntegerField(Number(year)) && Number(year) === 0) return false;

        if (month !== undefined)
            if (month.length !== 2 && !this.IntegerField(Number(month)) && Number(month) === 0) return false;

        if (day !== undefined)
            if (day.length !== 2 && !this.IntegerField(Number(day)) && Number(day) === 0) return false;

        return true;
    }

    TimeField(value: any): boolean {

        const part = value.split(':');
        if (part.length > 3) return false;

        const [hour, minute, seconde] = part;

        if (hour.length !== 2 && !this.IntegerField(Number(hour)) && Number(hour) < 0 && Number(hour) > 23) return false;

        if (minute !== undefined)
            if (hour.length !== 2 && !this.IntegerField(Number(hour)) && Number(hour) < 0 && Number(hour) > 60) return false;

        if (seconde !== undefined)
            if (hour.length !== 2 && !this.IntegerField(Number(hour)) && Number(hour) < 0 && Number(hour) > 60) return false;

        return true;
    }


    static requiredArg(value: any, required: boolean) {
        return !(value === undefined && required);
    }

    static allowBlankArg(value: any, allowBlank: boolean) {
        return !(typeof value === "string" && value.trim() === "" && !allowBlank);
    }


    static likeArg(value: any, like?: (string | number)[]) {
        return like === undefined ? true : like.includes(value);
    }

    static maxLengthArg(value: string, length: number) {
        return value.length <= length;
    }

    static minLengthArg(value: string, length: number) {
        return value.length >= length;
    }

    static maxValueArg(value: number, length: number) {
        return value <= length;
    }

    static minValueArg(value: number, length: number) {
        return value >= length;
    }

    static regexArg(value: string, pattern: RegExp) {
        return pattern.test(value);
    }
}


export default Validator;
