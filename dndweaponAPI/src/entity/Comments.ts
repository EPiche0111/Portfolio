import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Weapon} from "./Weapon";
import {IsNotEmpty} from "class-validator";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    commentID: number

    @Column({type:'varchar', length:150, nullable: false})
    @IsNotEmpty({message: 'Comment is Required'})
    comment: string

    @ManyToOne(() => User, (user) => user.comment, { nullable: false, eager: true })
    @IsNotEmpty({message: 'User is Required'})
    user: User

    @ManyToOne(() => Weapon, (weapon) => weapon.comment,{ nullable: false, eager: true })
    @IsNotEmpty({message: 'User is Required'})
    weapon: Weapon
}
