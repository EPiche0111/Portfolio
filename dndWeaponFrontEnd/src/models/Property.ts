import { IsOptional, Length } from 'class-validator';

export default class Property {
  @IsOptional()
  propertyID: number | undefined

    @Length(1, 100, { message: 'property must be from $constraint1 to $constraint2 characters' })
    property!:string
}
