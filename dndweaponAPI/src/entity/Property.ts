import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Length} from "class-validator";

@Entity()
export class Property {
    @PrimaryGeneratedColumn()
    propertyID: number

    @Column({type: 'varchar', length: 100})
    @Length(1,100, {message: 'property must be from $constraint1 to $constraint2 characters'})
    property: string
}
