import * as bodyParser from 'body-parser'
import {AppDataSource} from './data-source'
import {UserController} from './controller/UserController'
import {createExpressServer} from 'routing-controllers'
import * as createError from 'http-errors'
import WeaponController from './controller/WeaponController'
import CommentsController from './controller/CommentsController'
import LoginController from "./controller/LoginController";
import {Property} from "./entity/Property";

// I can GET, PUT, POST, and DELETE on Google Chrome, but I am running into a content security policy issue
// on edge.
const corsOptions = {
    origin: /localhost\:\d{4,5}$/i,
    credentials: true,
    allowedHeaders: 'Origin, x-request-with, Content-Type, Accept, Authorization, Access-Control-Allow-Methods, access-control-allow-origin, access-control-allow-credentials, access-control-allow-headers',
    methods: 'GET,PUT,POST,DELETE',
    maxAge: 43200, // 12 hours
}




AppDataSource.initialize().then(async () => {

    // create express app
    //const app = express()
    const app = createExpressServer({
        cors: corsOptions,
        controllers: [UserController, WeaponController, CommentsController, LoginController],
    })
    app.use(bodyParser.json())



    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404))
    })
    // error handler
    app.use(function (err, req, res, next) {
        if (!res._headerSent) {
            res.status(err.status || 500)
            res.json({status: err.status, message: err.message, stack: err.stack.split(/\s{4,}/)})
        }
    })

    app.listen(3004)

    // Sets up the property entity, so they can be used in weapon.
    await AppDataSource.manager.save(
        [
            AppDataSource.manager.create(Property, {
                propertyID: 1,
                property: "ammunition"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 2,
                property: "finesse"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 3,
                property: "heavy"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 4,
                property: "light"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 5,
                property: "loading"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 6,
                property: "range"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 7,
                property: "reach"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 8,
                property: "special"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 9,
                property: "thrown"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 10,
                property: "two-handed"
            }),
            AppDataSource.manager.create(Property, {
                propertyID: 11,
                property: "versatile"
            })
        ]
    )

    console.log('Express server has started on port 3000. Open http://localhost:3004/weapons to see results')

}).catch(error => console.log(error))
