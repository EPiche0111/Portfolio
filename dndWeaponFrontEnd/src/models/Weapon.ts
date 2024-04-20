import {
  IsNotEmpty, IsOptional, Length, Matches, Min,
} from 'class-validator';
import User from './User';
import Property from './Property';

export default class Weapon {
    weaponID!: number

    @Length(1, 150, { message: 'Weapon Name must be from $constraint1 to $constraint2 characters' })
    @IsNotEmpty({ message: 'Weapon Name is Required' })
    name!:string

    @Matches(/^Simple$|^Martial$/, { message: 'Weapon Category Must be either Simple or Martial' })
    @Length(6, 7, { message: 'weaponCategory Must be only 6-7 characters long' })
    @IsNotEmpty({ message: 'weaponCategory is Required' })
    weaponCategory!:string

    @Matches(/^Melee$|^Range$/i, { message: 'Weapon Range Must be either Melee or Range' })
    @Length(5, 5, { message: 'Weapon Range Must be only 5 characters long' })
    @IsNotEmpty({ message: 'Weapon Range is Required' })
    weaponRange!:string

    @Matches(/^\d+d(4|6|8|10|12|20)$/, { message: 'Damage Dice Must be int the format #d## with the last number being either 4, 6, 8, 10, 12, or 20' })
    @IsNotEmpty({ message: 'Damage Dice is Required' })
    damageDice!:string

    @Length(1, 50, { message: 'Damage Type must be from $constraint1 to $constraint2 characters' })
    @IsNotEmpty({ message: 'Damage Type is Required' })
    damageType!:string

    @IsOptional()
    properties: Property[] | undefined

    @Min(0, { message: 'Weight can not be a negative' })
    @IsNotEmpty({ message: 'Weight is Required' })
    weight!: number

    @IsOptional()
    @Min(0, { message: 'Minimum Range can not be a negative' })
    minRange: number | undefined

    @IsOptional()
    @Min(0, { message: 'Maximum Range can not be a negative' })
    maxRange: number | undefined

    @IsOptional()
    @Length(0, 1200, { message: 'Description must be from $constraint1 to $constraint2 characters' })
    description: string | undefined

    @IsNotEmpty({ message: 'User is Required' })
    user!: User|number
}
