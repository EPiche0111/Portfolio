import {Body, Delete, Get, HeaderParam, JsonController, Param, Post, Put, Req, Res} from "routing-controllers";
import {AppDataSource} from "../data-source";
import {Weapon} from "../entity/Weapon";
import {validate, ValidatorOptions} from "class-validator";
import {Request, Response} from 'express';
import {checkJWT, determineAccess} from "./JWTAuthenticationMethods";
import {Property} from "../entity/Property";

@JsonController()
export default class WeaponController {

    private weaponRepository = AppDataSource.getRepository(Weapon)

    private validOptions: ValidatorOptions = {
        stopAtFirstError: true,
        skipMissingProperties: false,
        validationError: {target: false, value: false},
    };

    //gets the weapons from an api call if ID is given returns a specific weapon
    @Get('/weapons/:id/' )
    async readOne(@Req() req: Request, @Res() res: Response) {
        // Sets the weapon to a variable
        const weaponToReturn = await this.weaponRepository.findOne({where: {weaponID: req.params.id}});
        // // gets the user id form the weapon's user.
        // const userID = weaponToReturn.user.userID;
        // // deletes the user property so that it is not displayed.
        // delete weaponToReturn["user"];
        // // returns the weapon as an object sans the user id
        // return { ...weaponToReturn, userID: userID};
        return weaponToReturn;

    }
    @Get('/weapons/' )
    async readAll(@Req() req: Request, @Res() res: Response) {
        // The list of weapons in the database
        const weaponsList = await this.weaponRepository.find()
        // The list of objects to be returned.
        const returnList = [];
        // Loops through the weapons in the weapons list
        // for (const weapon of weaponsList) {
        //     // Gets the userID of each weapon's user
        //     const userID = weapon.user.userID
        //     // Deletes the user object form the weapon
        //     delete weapon.user;
        //     // pushes the object into the return list
        //     returnList.push({ ...weapon, userID: userID });
        // }
        // Returns the list.
        // return returnList;
        return weaponsList;

    }
    //deletes a weapon from the api for the ID of a specific weapon
    @Delete('/weapons/:id')
    async delete(@Req() req: Request, @Res() res: Response, @HeaderParam("authorization") token: string) {
        const weaponToRemove = await this.weaponRepository.findOne(  {where: {weaponID: req.params.id}})
        const weaponsUserId = weaponToRemove.user.userID;
        // Validates the token's access level and decodes the token to use later.
        let isValidToken = await determineAccess(token, weaponsUserId);
        let decoded = await checkJWT(token.replace("Bearer ", ""), weaponsUserId);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return decoded;
        }


        res.statusCode = 204
        if (weaponToRemove) return this.weaponRepository.remove(weaponToRemove)
        else{
            //do nothing
        }
    }

    @Put('/weapons/:confirmid')
    async update(@Body() reqBody: any,
                 @Param('confirmid') confirmid: number,
                 @Res() res: Response,
                 @HeaderParam("authorization") token: string
    ) {
        // Validates the token's access level and decodes the token to use later.
        let isValidToken = await determineAccess(token, reqBody.userID);
        let decoded = await checkJWT(token.replace("Bearer ", ""), reqBody.userID);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return decoded;
        }
        reqBody["user"] = decoded;

        /*     PRELOAD - https://typeorm.io/#/repository-api
        Creates a new entity from the plain javascript object.
        If the entity already exists in the database, then it loads it and replaces all values with the new ones from the given object,
        and returns a new entity that is actually an entity loaded from the database with all properties replaced from the new object.
        Note that given entity-like object must have an entity id / primary key to find entity by.
        Returns undefined if entity with given id was not found.
    */
        const weaponToUpdate = await this.weaponRepository.preload(reqBody)

        // Extra validation - ensure the id param matched the id submitted in the body
        if (!weaponToUpdate || weaponToUpdate.weaponID != confirmid){
            // do nothing
        }
        else {
            const violations = await validate(weaponToUpdate, this.validOptions)
            if (violations.length) {
                res.statusCode = 422 // Unprocessable Entity
                return violations
            } else {
                const weaponReturned = await this.weaponRepository.save(weaponToUpdate);
                weaponReturned["user"] = decoded.userID;
                return weaponReturned;
            }
        }
    }

    @Post('/weapons')
    async create(@Body() reqBody:any,@Res() res:Response, @HeaderParam("authorization") token: string){
        let isValidToken = await determineAccess(token, reqBody.userID);
        let decoded = await checkJWT(token.replace("Bearer ", ""), reqBody.userID);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return decoded;
        }
        reqBody["user"] = decoded;

        console.log(reqBody);
        const propRepository = AppDataSource.getRepository(Property);
        console.log(reqBody.properties);

        // gets the property name or id form the props from the
        let propIds = [];
        let propProperties = [];
        for (const prop of reqBody.properties) {
            propIds.push(prop.propertyID);
            propProperties.push(prop.property)
        }
        console.log(propIds);
        console.log(propProperties);

        // gets the property objects based on the properties entered.
        const props = await propRepository.createQueryBuilder("Property")
            .where("Property.propertyID IN (:...ids)", { ids: propIds })
            .orWhere("Property.property IN (:...props)", {props: propProperties})
            .distinct()
            .getMany();
        // assigns the properties to the Weapon object to be created.
        reqBody["properties"] = props;
        // creates the Weapon object from the reqBody.
        const weaponToCreate = Object.assign(new Weapon(), reqBody);
        // Validates the weapon created.
        const violations = await validate(weaponToCreate, this.validOptions);
        if (violations.length) {
            res.statusCode = 422 // Unprocessable Entity
            return violations
        } else {
            const weaponToReturn = await  this.weaponRepository.save(weaponToCreate);
            // Ensures that user information is not passed back along with the weapon just the id.
            weaponToReturn["user"] = weaponToReturn["user"].userID;
            return weaponToReturn;
        }
    }

}
