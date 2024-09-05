import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions
} from "class-validator";

@ValidatorConstraint()
class PasswordValidator implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    return value.length >= 8 && value.length <= 15;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Password must be between 8 and 15 characters";
  }
}

export const IsPasswordValid = (validationOptions?: ValidatorOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PasswordValidator
    });
  };
};