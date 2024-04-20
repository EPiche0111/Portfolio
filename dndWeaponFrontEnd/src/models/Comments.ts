import { IsNotEmpty, IsOptional } from 'class-validator';
import User from './User';
import Weapon from './Weapon';

export default class Comments {
    @IsOptional()
    commentID: number | undefined

    @IsNotEmpty({ message: 'Comment is Required' })
    comment!: string

    @IsNotEmpty({ message: 'User is Required' })
    user!: User | number

    @IsNotEmpty({ message: 'User is Required' })
    weaponID!: Weapon|number
}
