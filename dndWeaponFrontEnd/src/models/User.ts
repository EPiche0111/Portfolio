import {
  IsBoolean, IsEmail, IsNotEmpty, IsOptional, Length, Matches, Max, MaxLength, Min,
} from 'class-validator';
import Weapon from './Weapon';
import Comments from '@/models/Comments';

export default class User {
    userID!: number

    @Length(1, 150, { message: 'Username must be from $constraint1 to $constraint2 characters' })
    @IsNotEmpty({ message: 'Username is Required' })
    username!: string

    @Matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      { message: 'Password must contain uppercase, lowercase, and numbers' },
    )
    @Length(8, 25, { message: 'Password must be from $constraint1 to $constraint2 characters ' })
    @IsNotEmpty({ message: 'Password is Required' })
    password: string | undefined;

    @IsNotEmpty({ message: 'You must confirm your password.' })
    confirmPassword!: string;

    @MaxLength(320, { message: 'The email must be at most $constraint1 characters' })
    @IsNotEmpty({ message: 'Email is Required' })
    @IsEmail()
    email!:string

    @IsNotEmpty({ message: 'Admin is Required' })
    @IsBoolean()
    admin = false
}
