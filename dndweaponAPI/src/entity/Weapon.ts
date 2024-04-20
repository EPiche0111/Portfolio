import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, Length, Matches, Min} from "class-validator";
import {User} from "./User";
import {Property} from "./Property";
import {Comments} from "./Comments";

@Entity()
export class Weapon {
    @PrimaryGeneratedColumn()
    weaponID: number

    @Column({type:'varchar', length:150})
    @Length(1,150, {message: 'name must be from $constraint1 to $constraint2 characters'})
    @IsNotEmpty({message: 'name is Required'})
    name: string

    @Column({type:'varchar', length:7})
    @Matches(/^Simple$|^Martial$/, {message:"weaponCategory Must be either Simple or Martial"})
    @Length(6,7,{message: "weaponCategory Must be only 6-7 characters long"})
    @IsNotEmpty({message: 'weaponCategory is Required'})
    weaponCategory: string

    @Column({type:'varchar', length:5})
    @Matches(/^Melee$|^Range$/, {message:"weaponRange Must be either Melee or Range"})
    @Length(5,5,{message: "weaponRange Must be only 5 characters long"})
    @IsNotEmpty({message: 'weaponRange is Required'})
    weaponRange: string

    @Column({type:'varchar', length:25})
    @Matches(/^\d+d(4|6|8|10|12|20)$/, {message:"damageDice Must be int the format #d## with the last number being either 4, 6, 8, 10, 12, or 20"})
    @IsNotEmpty({message: 'damageDice is Required'})
    damageDice: string

    @Column({type:'varchar', length:50})
    @Length(1,50, {message: 'damageType must be from $constraint1 to $constraint2 characters'})
    @IsNotEmpty({message: 'damageType is Required'})
    damageType: string

    @ManyToMany(()=>Property, {nullable:true, eager: true})
    @JoinTable()
    @IsOptional()
    properties: Property[]

    @Column({type:'integer'})
    @Min(0,{message:'weight can not be a negative'})
    @IsNotEmpty({message: 'weight is Required'})
    weight: number

    @Column({type:'integer', nullable:true})
    @IsOptional()
    @Min(0,{message:'minRange can not be a negative'})
    minRange: number

    @Column({type:'integer', nullable:true})
    @IsOptional()
    @Min(0,{message:'maxRange can not be a negative'})
    maxRange: number

    @Column({type:'varchar', length:1200, nullable:true})
    @IsOptional()
    @Length(0,1200, {message: 'description must be from $constraint1 to $constraint2 characters'})
    description: string

    @ManyToOne(() => User, (user) => user.weapons,{
        nullable: false,
        eager: true
    })
    @IsNotEmpty({message: 'User is Required'})
    user: User

    @OneToMany(()=> Comments, (comment)=>comment.weapon)
    comment: Comments[]
}
