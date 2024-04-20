import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from 'typeorm'
import {IsBoolean, IsEmail, IsNotEmpty, Length, Matches, Max, MaxLength, Min} from 'class-validator'
import {Weapon} from "./Weapon";
import {Comments} from "./Comments";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userID: number

    @Column({type:'varchar', length:150, nullable: false, unique: true})
    @Length(1,150, {message: 'Username must be from $constraint1 to $constraint2 characters'})
    @IsNotEmpty({message: 'Username is Required'})
    username: string

    @Column('nvarchar', {length: 25, nullable: false, select: false /* hide password from regular query*/})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {message: 'Password must contain uppercase, lowercase, and numbers'})
    @Length(8, 25, {message: 'Password must be from $constraint1 to $constraint2 characters '})
    @IsNotEmpty({message: 'Password is Required'})
    password: string;

    @Column({type:'varchar',length:320, nullable: false, unique: true})
    @MaxLength(320, {message:'The email must be at most $constraint1 characters'})
    @IsNotEmpty({message: 'Email is Required'})
    @IsEmail()
    email:string

    @Column({type:'boolean', nullable: false, select: false})
    @IsNotEmpty({message: 'Admin is Required'})
    @IsBoolean()
    admin: boolean

    @OneToMany(()=> Weapon, (weapon)=>weapon.user)
    weapons: Weapon[]

    @OneToMany(()=> Comments, (comment)=>comment.user)
    comment: Comments[]

}
