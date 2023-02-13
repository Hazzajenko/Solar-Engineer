export interface ErrorModel {
  property: string
  errorMessage: string
}

export interface FormattedMessagePlaceholderValues {
  RegularExpression: string;
  PropertyName: string;
  PropertyValue: string;
}

export interface ValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue: string;
  customState?: any;
  severity: number;
  errorCode: string;
  formattedMessagePlaceholderValues: FormattedMessagePlaceholderValues;
}