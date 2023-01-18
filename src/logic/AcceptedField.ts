import { CharFieldProperties, DateFieldProperties, DateTimeFieldProperties, EmailFieldProperties, FieldValidator, FloatFieldProperties, IntegerFieldProperties, RegexFieldProperties, TimeFieldProperties } from "../types";

abstract class AcceptedField {
    abstract CharField(args?: CharFieldProperties, value?: any): boolean | FieldValidator;
    abstract EmailField(args?: EmailFieldProperties, value?: any): boolean | FieldValidator;
    abstract RegexField(args?: RegexFieldProperties, value?: any): boolean | FieldValidator;
    abstract IntegerField(args?: IntegerFieldProperties, value?: any): boolean | FieldValidator;
    abstract FloatField(args?: FloatFieldProperties, value?: any): boolean | FieldValidator;
    abstract DateTimeField(args?: DateTimeFieldProperties, value?: any): boolean | FieldValidator;
    abstract DateField(args?: DateFieldProperties, value?: any): boolean | FieldValidator;
    abstract TimeField(args?: TimeFieldProperties, value?: any): boolean | FieldValidator;
}

export default AcceptedField;

