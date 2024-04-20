import {
  isEmail,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// A custom validation class for
@ValidatorConstraint({ name: 'customText', async: false })
export default class IsEmailOrUsername implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (text) {
      return isEmail(text) ? true : (text.length > 1 && text.length < 150);
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}
