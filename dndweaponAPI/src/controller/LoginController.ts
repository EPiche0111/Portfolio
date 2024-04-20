import {Body, HeaderParam, JsonController, Post} from "routing-controllers";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {encodeJWT} from "./JWTAuthenticationMethods";

/**
 * This class will be used to handle authentication for the API. It will only
 * have a post method that will return the jwt bearer token.
 */
@JsonController()
export default class LoginController {
    // A connection to the user repository.
    private userRepo = AppDataSource.getRepository(User);

    @Post("/login")
    async getJWT(@Body() reqBody: any) {
        // const perspectiveUser = await this.userRepo.findOne({where: { username: reqBody.username },
        const perspectiveUser = await this.userRepo.createQueryBuilder("user")
            .where({username: reqBody.username})
            .orWhere({email: reqBody.username})
            .getOne();
        if (perspectiveUser) {
            try {
                // if the user uses their email this will overwrite the reqBody email so that it can
                // be evaluated properly and encoded.
                reqBody.username = perspectiveUser.username
                const token = await encodeJWT(reqBody);
                return { token: token, username: perspectiveUser.username, userId: perspectiveUser.userID};
            } catch (err) {
                return { Error: err.message };
            }

        } else {
            return { Error: "Invalid user credentials." };
        }
    }
}
