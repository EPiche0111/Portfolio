import User from '@/models/User';
import Property from '@/models/Property';

export default class WeaponViolation {
  name!:string

  weaponCategory!:string

  weaponRange!:string

  damageDice!:string

  damageType!:string

  properties: Property[] | undefined

  weight!: number

  minRange: number | undefined

  maxRange: number | undefined

  description: string | undefined
}
