/* eslint-disable no-mixed-spaces-and-tabs */
import {AppDataSource} from '../data-source'
import {NextFunction, Request, Response} from 'express'
import {User} from '../entity/User'
import {isInstance, validate, ValidatorOptions} from 'class-validator'
import {JsonController, Get, Req, Param, Post, Res, Delete, Body, Put, HeaderParam} from 'routing-controllers'
import {checkJWT, determineAccess} from "./JWTAuthenticationMethods";

@JsonController()
export class UserController {

    private userRepository = AppDataSource.getRepository(User)
	private validOptions: ValidatorOptions = {
		stopAtFirstError: true,
		skipMissingProperties: false,
		validationError: {target: false, value: false},
		forbidUnknownValues: false,
	};

	//gets the users from an api call if ID is given returns a specific user
	@Get('/user/:id*?' )
	async read(@Req() req: Request, @Res() res: Response) {
		if (req.params.id) return this.userRepository.findOne({where: {userID: req.params.id}} )
		else {
			return this.userRepository.find()
		}
	}

	//deletes a user from the api for the ID of a specific user
	@Delete('/user/:id')
	async delete(@Req() req: Request, @Res() res: Response, @HeaderParam("authorization") token: string) {
		// checks the validity of the token and its access
		let isValidToken = await determineAccess(token, req.params.id);
		if (!isValidToken)  {
			// if the token does not have access runs check again to produce an error message
			// to be returned to the user.
			return checkJWT(token.replace("Bearer ", ""), req.params.id);
		}

		const userToRemove = await this.userRepository.findOne(  {where: {userID: req.params.id}})
		res.statusCode = 204
		if (userToRemove) return this.userRepository.remove(userToRemove)
		else{
			//do nothing
		}
	}


	@Put('/user/:confirmid')
	async update(@Body() reqBody: any,
				 @Param('confirmid') confirmid: number,
				 @Res() res: Response,
				 @HeaderParam("authorization") token: string) {

		// checks the validity of the token and its access
		let isValidToken = await determineAccess(token, reqBody.userID);
		if (!isValidToken)  {
			// if the token does not have access runs check again to produce an error message
			// to be returned to the user.
			return checkJWT(token.replace("Bearer ", ""), reqBody.userID);
		}

		/* PRELOAD - https://typeorm.io/#/repository-api
		Creates a new entity from the plain javascript object.
		If the entity already exists in the database, then it loads it and replaces all values with the new ones from the given object,
		and returns a new entity that is actually an entity loaded from the database with all properties replaced from the new object.
		Note that given entity-like object must have an entity id / primary key to find entity by.
		Returns undefined if entity with given id was not found.
    	*/
		const userToUpdate = await this.userRepository.preload(reqBody)

		// Extra validation - ensure the id param matched the id submitted in the body
		if (!userToUpdate || userToUpdate.userID != confirmid){
			// do nothing
		}
		else {
			const violations = await validate(userToUpdate, this.validOptions)
			if (violations.length) {
				res.statusCode = 422 // Unprocessable Entity
				return violations
			} else {
				try {
					// User object to be returned along with an additional notice
					// to let the user know they need to log in again for their credentials to be up-to-date.
					const retUserObj = await this.userRepository.save(userToUpdate);
					retUserObj["notice"] = "You will have to login again to update your credentials.";
					return retUserObj;
				} catch (err) {
					// if the username is not unique it will throw the SQLITE_CONSTRAINT_UNIQUE error
					// this will let the user know in a more succinct way that their username is already taken
					if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
						return { error: "User name is not unique."}
					}
				}
				// User object to be returned along with an additional notice
				// to let the user know they need to log in again for their credentials to be up-to-date.
				const retUserObj = await this.userRepository.save(userToUpdate);
				retUserObj["notice"] = "You will have to login again to update your credentials.";
				return retUserObj;
			}
		}
	}

	@Post('/user')
	async create(@Body() reqBody:any,@Res() res:Response){
		// sets the requests body to an object
		const userToCreate = Object.assign(new User(), reqBody)
		// validates the object
		const violations = await validate(userToCreate, this.validOptions)
		if (violations.length) {
			res.statusCode = 422 // Unprocessable Entity
			return violations;
		} else {
			// Tries to create a user
			try {
				return await this.userRepository.save(userToCreate);
			} catch (err) {
				// if the username is not unique it will throw the SQLITE_CONSTRAINT_UNIQUE error
				// this will let the user know in a more succinct way that their username is already taken
				if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
					return { error: "User name is not unique."}
				}
			}
		}
	}

}
