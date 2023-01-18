import { FieldValidator, CharFieldProperties, IntegerFieldProperties, DateFieldProperties, DateTimeFieldProperties, EmailFieldProperties, FloatFieldProperties, RegexFieldProperties, TimeFieldProperties } from "../types";
import { error_messages, init_object_property } from "../utils/helpers";
import AcceptedField from "./AcceptedField";
import Validator from "./Validator";

class Serializer extends AcceptedField {
    public data: { [x: string]: any };
    protected validator!: { [x: string]: FieldValidator; };
    private errors: { [x: string]: any } = {};
    private isValid: boolean | undefined = undefined;
    private defaultMaxLength: number = 50;
    private defaultMinLength: number = 0;
    private defaultMaxValue: number = 999.999 * 1000;
    private defaultMinValue: number = 0;
    private defaultRequired: boolean = true;
    private defaultAllowBlank: boolean = false;

    constructor(data: { [x: string]: any }) {
        super();
        this.data = data;
    }

    get is_valid() {
        if (this.isValid === undefined) {
            console.error("Do not call is_valid before validating the data"
                + "\nFalse statement:\n\tYourSerializer.is_valid()\n\tYourSerializer.validate()"
                + "\nTrue statement:\n\tYourSerializer.validate()\n\tYourSerializer.is_valid()"
            );

            throw new Error("^^^Invalid Statement^^^");
        }
        else return this.isValid;
    }

    validate() {
        const unknownFields = Validator.GetUnknownField(this.validator, this.data);
        unknownFields.forEach((field) => {
            init_object_property(this.errors, field);
            this.errors[field] = "Unknown field !";
        });

        let i = 0;
        const fields = Object.keys(this.validator);
        const tmpValidator: { [x: string]: FieldValidator; } = JSON.parse(JSON.stringify(this.validator));
        let tmpError: string[] = [];

        while (fields.length > i) {
            const field = fields[i];
            let value = this.data[field];
            const fieldType = tmpValidator[field].fieldType;
            const args = tmpValidator[field].args;
            let errorMsg: string;

            // autoNowAdd argument
            if (args.kind === "DateField" && args.autoNowAdd) {
                const date = new Date();
                if (fieldType === "DateTimeField")
                    this.data[field] = date.getTime();
                if (fieldType === "DateField")
                    this.data[field] = date.toISOString().split("T")[0];
                if (fieldType === "TimeField")
                    this.data[field] = date.toISOString().split("T")[1].substring(0, 8);
            }

            // defaultValue argument
            if (value === undefined) {
                if (args.defaultValue !== undefined && args.defaultValue !== "")
                    this.data[field] = args.defaultValue;
                value = this.data[field];
            }

            // required argument
            const required = args.required === undefined ? this.defaultRequired : args.required;

            if (!Validator.requiredArg(value, required)) {
                errorMsg = "Required field !";
                if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
            }

            Validator.Is({ fieldType, value }, (result) => {
                if (!result) {
                    errorMsg = args.errorMessage || error_messages(fieldType);

                    if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);

                    // or argument
                    if (args.or === undefined) {
                        init_object_property(this.errors, field);
                        this.errors[field] = tmpError;
                        tmpError = [];
                        return;
                    }

                    tmpValidator[field] = args.or;
                    i--;
                } else {
                    tmpError = [];

                    // trimWhitespace argument
                    if ((args.kind === "StringField" || args.kind === "RegexField")) {
                        args.trimWhitespace = args.trimWhitespace === undefined ? true : args.trimWhitespace;
                        this.data[field] = args.trimWhitespace ? this.data[field].trim() : this.data[field];
                    }

                    // partten argument
                    if (args.kind === "RegexField" && !Validator.regexArg(value, args.pattern)) {
                        if (!tmpError.includes(args.errorMessage as string)) tmpError.push(args.errorMessage as string);
                        else return;
                    }

                    // allowBlank argument
                    const allowBlankArg = args.allowBlank === undefined ? this.defaultAllowBlank : args.allowBlank;

                    if (!Validator.allowBlankArg(value, allowBlankArg)) {
                        errorMsg = "Value cannot be blank !";
                        if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                    }

                    // like argument
                    if (!Validator.likeArg(value, args.like)) {
                        errorMsg = `Valid value is: ${args.like?.join(', ')}`;
                        if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                    }

                    if (args.kind === "StringField" && (args.like === undefined || args.like.length === 0)) {
                        // maxLength argument
                        const maxLength = args.maxLength || this.defaultMaxLength;
                        if (!Validator.maxLengthArg(value, maxLength)) {
                            errorMsg = `The value max length is ${maxLength}`;
                            if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                        }

                        // minLength argument
                        const minLength = args.minLength || this.defaultMinLength;
                        if (!Validator.minLengthArg(value, minLength)) {
                            errorMsg = `The value min length is ${minLength}`;
                            if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                        }
                    }

                    if (args.kind === "NumericField" && (args.like === undefined || args.like.length === 0)) {
                        // maxValue argument
                        const maxValue = args.maxValue || this.defaultMaxValue;
                        if (!Validator.maxValueArg(value, maxValue)) {
                            errorMsg = `The value max length is ${maxValue}`;
                            if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                        }

                        // minValue argument
                        const minValue = args.minValue || this.defaultMinValue;
                        if (!Validator.minValueArg(value, minValue)) {
                            errorMsg = `The value min length is ${minValue}`;
                            if (!tmpError.includes(errorMsg)) tmpError.push(errorMsg);
                        }
                    }


                    if (tmpError.length > 0) {
                        init_object_property(this.errors, field);
                        this.errors[field] = tmpError;
                        tmpError = [];
                    }
                }
            });

            i++;
        }

        this.isValid = this.errors.length > 0 ? false : true;
    }

    CharField(args?: CharFieldProperties): FieldValidator {
        args = args || {};
        args.kind = "StringField";

        return {
            fieldType: "CharField",
            args
        }
    }

    EmailField(args?: EmailFieldProperties | undefined, value?: any): boolean | FieldValidator {
        args = args || {};
        args.kind = "StringField";

        return {
            fieldType: "EmailField",
            args
        }
    }

    IntegerField(args?: IntegerFieldProperties): FieldValidator {
        args = args || {};
        args.kind = "NumericField";

        return {
            fieldType: "IntegerField",
            args: args || {}
        }
    }

    FloatField(args?: FloatFieldProperties | undefined, value?: any): boolean | FieldValidator {
        args = args || {};
        args.kind = "NumericField";

        return {
            fieldType: "FloatField",
            args: args || {}
        }
    }

    DateTimeField(args?: DateTimeFieldProperties | undefined, value?: any): boolean | FieldValidator {
        args = args || {};
        args.kind = "DateField";

        return {
            fieldType: "DateTimeField",
            args: args || {}
        }
    }

    DateField(args?: DateFieldProperties | undefined, value?: any): boolean | FieldValidator {
        args = args || {};
        args.kind = "DateField";

        return {
            fieldType: "DateField",
            args: args || {}
        }
    }

    TimeField(args?: TimeFieldProperties | undefined, value?: any): boolean | FieldValidator {
        args = args || {};
        args.kind = "DateField";

        return {
            fieldType: "TimeField",
            args: args || {}
        }
    }

    RegexField(args: RegexFieldProperties, value?: any): boolean | FieldValidator {
        args.kind = "RegexField";

        return {
            fieldType: "RegexField",
            args
        }
    }
}

export default Serializer;
