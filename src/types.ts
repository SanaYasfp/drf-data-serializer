interface FieldProperties {
    required?: boolean,
    allowBlank?: boolean,
    defaultValue?: string,
    errorMessage?: string,
    // readOnly?: boolean,
    // writeOnly?: boolean,
    like?: number[] | string[],
    or?: FieldValidator,
};

export interface CharFieldProperties extends FieldProperties {
    kind?: "StringField",
    maxLength?: number,
    minLength?: number,
    trimWhitespace?: boolean,
};

export interface EmailFieldProperties extends CharFieldProperties { };

export interface IntegerFieldProperties extends FieldProperties {
    kind?: "NumericField",
    maxValue?: number,
    minValue?: number,
};

export interface FloatFieldProperties extends IntegerFieldProperties { };

export interface DateTimeFieldProperties extends FieldProperties {
    kind?: "DateField",
    autoNowAdd?: boolean,
};

export interface DateFieldProperties extends DateTimeFieldProperties { };

export interface TimeFieldProperties extends DateTimeFieldProperties { };

export interface RegexFieldProperties extends FieldProperties {
    kind?: "RegexField",
    pattern: RegExp,
    trimWhitespace?: boolean,
    errorMessage: string,
};

export type Fields =
    "CharField" |
    "EmailField" |
    "RegexField" |
    "IntegerField" |
    "FloatField" |
    "DateTimeField" |
    "DateField" |
    "TimeField";

export interface FieldValidator {
    fieldType: Fields,
    args: CharFieldProperties |
    EmailFieldProperties |
    RegexFieldProperties |
    IntegerFieldProperties |
    FloatFieldProperties |
    DateTimeFieldProperties |
    DateFieldProperties |
    TimeFieldProperties;
}
