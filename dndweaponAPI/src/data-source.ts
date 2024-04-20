import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import {Weapon} from "./entity/Weapon";
import {Property} from "./entity/Property";
import {Comments} from "./entity/Comments";

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: 'sqlite.db',
	synchronize: true,
	logging: false,
	entities: [User, Weapon, Property, Comments],
	migrations: [],
	subscribers: [],
})
