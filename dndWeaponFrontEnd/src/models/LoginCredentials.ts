import {
  isEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  Validate,
  ValidateIf, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator';
import IsEmailOrUsername from '@/models/IsEmailOrUsername';

export default class LoginCredentials {
    userID!: number

    @Matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      { message: 'Password must contain uppercase, lowercase, and numbers' },
    )
    @Length(8, 25, { message: 'Password must be from $constraint1 to $constraint2 characters ' })
    @IsNotEmpty({ message: 'Password is Required' })
    password!: string;

    @IsNotEmpty({ message: 'Email or Username is Required' })
    @MaxLength(320, { message: 'The email or username must be at most $constraint1 characters' })
    @Validate(IsEmailOrUsername, { message: 'Must be a valid username or email.' })
    emailOrUsername!: string;
}
