import User from '@/models/User';
import Weapon from '@/models/Weapon';

export default class CommentViolation {
    comment!: string

    user!: User | number

    weaponID!: Weapon|number
}
