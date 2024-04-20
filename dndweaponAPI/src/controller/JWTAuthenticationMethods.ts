import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import {User} from "../entity/User";
import {AppDataSource} from "../data-source";
import {isInstance} from "class-validator";

// Repository object to get user info
const userRepo = AppDataSource.getRepository(User);

/**
 * This method will encode as a jwt and uses the ES256 algorythm to
 * encrypt it using es256private.key file as a private key.
 * @param userToEncode an object to stringify and encrypt.
 */
export async function encodeJWT(userToEncode: any) {
    // Reads the private key
    const privateKey = fs.readFileSync('es256private.key');
    // if the user does not exist in the database it throws an error
    if (!(await userRepo.exist({where: {username: userToEncode.username}}))) {
        throw new Error("User does not exist")
    }
    // const perspectiveUser = await userRepo.findOne({
    //     select: {
    //         userID: true,
    //         username: true,
    //         admin: true,
    //         password: true
    //     },
    //     where: {
    //         userID: userToEncode.userID
    //     }
    // });
    const perspectiveUser = await getFullUserDetailsByUName(userToEncode.username);
    // User password matches the account they are trying to log in with
    if (perspectiveUser.password !== userToEncode.password) {
        throw new Error("Incorrect password.");
    }
    // Encodes a payload
    const token: string = jwt.sign({...perspectiveUser}, privateKey, {algorithm: 'ES256', expiresIn: '30m'});
    return token;
}

/**
 * This method will take an encrypted jwt and decrypt it
 * @param token the token to decode
 * @param userID the user id of the object that the user is trying to access
 */
export async function checkJWT(token: string, userID: number) {
    let decoded: any;
    try {
        // cert is the public key string
        const cert = fs.readFileSync('es256public.pem');
        decoded = jwt.verify(token, cert, {algorithm: 'ES256'});
        // The user object that the current user is trying to say they are.
        // const perspectiveUser = await userRepo.findOne({where: {userID: userID}});
        const perspectiveUser = await getFullUserDetailsByID(userID);
        // If the user exists and the user matches the passed in user id, or they are an admin
        // and if the user could not be found.
        if ((perspectiveUser && (decoded.userID === parseInt(String(userID)))) || decoded.admin) {
            // checks to se if the user password matches the user's object they are trying to access
            if (decoded.password !== perspectiveUser.password && !decoded.admin) {
                throw new Error("Incorrect password. If you have recently changed your password please log in again.")
            }
            // returns the decoded user
            return Object.assign(new User(), decoded);
        }
        // If the user doesn't pass the test throws an error.
        throw new Error("You do not have the correct permissions to access this object.");
    } catch (err) {
        console.log(`JWT Error:\n ${err}`);
        // returns the error message in an object if it fails
        decoded = {errMessage: err.message};
    }
    return decoded;
}


/**
 * This method will determine whether the token is valid and what permissions they will have.
 * @param token     Token from authentication header
 * @param userID    The userId tied to the object the current user is trying to manipulate.
 */
export async function determineAccess(token: string, userID: number) {
    // this boolean will be returned proving whether the user has access.
    let isValidToken = !!token; // if the token string exists it will be true
    // if the token is valid this variable will hold whatever object is returned from the token.
    let decodedToken: any;
    // If the token is defined
    if (isValidToken) {
        // Gets removes "the Bearer " from the front of the authentication token
        token = token.replace("Bearer ", "");
        // Decodes the token
        decodedToken = await checkJWT(token, userID)
        // if the token is an instance of user
        isValidToken = isValidToken && isInstance(decodedToken, User);
        // if the token is an instance of a user or is an admin.
        isValidToken = isValidToken || decodedToken.admin;
    }
    // returns the boolean to prove if the user is valid.
    return isValidToken;
}


const getFullUserDetailsByID = (userID: number) => userRepo.findOne({
    select: {
        userID: true,
        username: true,
        admin: true,
        password: true
    },
    where: {
        userID: userID
    }
});

const getFullUserDetailsByUName = (username: string) => userRepo.findOne({
    select: {
        userID: true,
        username: true,
        admin: true,
        password: true
    },
    where: {
        username: username
    }
});
