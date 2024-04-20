import {Body, Delete, Get, HeaderParam, JsonController, Param, Post, Put, Req, Res} from "routing-controllers";
import {AppDataSource} from "../data-source";
import {Comments} from "../entity/Comments";
import {Request, Response} from 'express';

import {validate, ValidatorOptions} from "class-validator";
import {checkJWT, determineAccess} from "./JWTAuthenticationMethods";

@JsonController("/weapons")
export default class CommentsController {

    private commentsRepository = AppDataSource.getRepository(Comments)

    private validOptions: ValidatorOptions = {
        stopAtFirstError: true,
        skipMissingProperties: false,
        validationError: {target: false, value: false},
    };

    //gets the comments from an api call if ID is given returns a specific comment
    @Get('/:wid/comments/:id*?' )
    async read(@Req() req: Request, @Res() res: Response) {
        if (req.params.id){
            const comment = await this.commentsRepository.findOne({where: {commentID: req.params.id,weapon: { weaponID: req.params.wid}}, relations: ['weapon']})
            // Gets the weaponID of comment user
            const weaponID = comment.weapon.weaponID

            // Deletes the weapon object form the comment
            delete comment.weapon;

            return { ...comment, weaponID:weaponID }
        }
        else {
            const commentsList = await this.commentsRepository.find({where: {weapon: { weaponID: req.params.wid}}, relations: ['weapon']})
            // The list of objects to be returned.
            const returnList = [];
            for (const comment of commentsList) {
                // Gets the weaponID of each comment's user
                const weaponID = comment.weapon.weaponID

                // Deletes the user and weapon object form the comment
                delete comment.weapon;
                // pushes the object into the return list
                returnList.push({ ...comment, weaponID:weaponID });
            }
            return returnList
        }
    }

    //deletes a comments from the api for the ID of a specific comments
    @Delete('/:wid/comments/:id')
    async delete(@Req() req: Request, @Res() res: Response,@HeaderParam("authorization") token: string) {
        //gets the comment so we can find the user ID
        const comment = await this.commentsRepository.findOne({where: {commentID: req.params.id,weapon: { weaponID: req.params.wid}}, relations: ['weapon']})
        // checks the validity of the token and its access
        let isValidToken = await determineAccess(token, comment.user.userID);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return checkJWT(token.replace("Bearer ", ""), req.params.id);
        }
        const commentsToRemove = await this.commentsRepository.findOne({where: {commentID: req.params.id,weapon: { weaponID: req.params.wid}}, relations: ['weapon']})
        res.statusCode = 204
        if (commentsToRemove) return this.commentsRepository.remove(commentsToRemove)
        else{
            //do nothing
        }
    }

    @Put('/:wid/comments/:confirmid')
    async update(@Body() reqBody: any, @Param('confirmid') confirmid: number,  @Param('wid') wid: number,@Res() res: Response,@HeaderParam("authorization") token: string) {
        // checks the validity of the token and its access
        let isValidToken = await determineAccess(token, reqBody.userID);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return checkJWT(token.replace("Bearer ", ""), reqBody.userID);
        }
        /*     PRELOAD - https://typeorm.io/#/repository-api
        Creates a new entity from the plain javascript object.
        If the entity already exists in the database, then it loads it and replaces all values with the new ones from the given object,
        and returns a new entity that is actually an entity loaded from the database with all properties replaced from the new object.
        Note that given entity-like object must have an entity id / primary key to find entity by.
        Returns undefined if entity with given id was not found.
    */
        // sets the weapon to be the one specified in the url
        reqBody.weapon =wid
        const commentsToUpdate = await this.commentsRepository.preload(reqBody)

        // Extra validation - ensure the id param matched the id submitted in the body
        if (!commentsToUpdate || commentsToUpdate.commentID != confirmid){
            // do nothing
        }
        else {
            const violations = await validate(commentsToUpdate, this.validOptions)
            if (violations.length) {
                res.statusCode = 422 // Unprocessable Entity
                return violations
            } else {
                return this.commentsRepository.save(commentsToUpdate)
            }
        }
    }

    @Post('/:wid/comments')
    async create(@Body() reqBody:any, @Param('wid') wid: number,@Res() res:Response,@HeaderParam("authorization") token: string){
        let isValidToken = await determineAccess(token, reqBody.userID);
        let decoded = await checkJWT(token.replace("Bearer ", ""), reqBody.userID);
        if (!isValidToken)  {
            // if the token does not have access runs check again to produce an error message
            // to be returned to the user.
            return decoded;
        }
        reqBody["user"] = decoded;
        // sets the weapon to be the one specified in the url
        reqBody.weapon =wid
        // sets the requests body to an object
        const commentsToCreate = Object.assign(new Comments(), reqBody)
        const violations = await validate(commentsToCreate, this.validOptions)
        if (violations.length) {
            res.statusCode = 422 // Unprocessable Entity
            return violations
        } else {
            // return this.commentsRepository.save(commentsToCreate)
            const commentsToReturn = await  this.commentsRepository.save(commentsToCreate);
            // Ensures that user information is not passed back along with the weapon just the id.
            commentsToReturn["user"] = commentsToReturn["user"].userID;
            return commentsToReturn;
        }
    }

}
