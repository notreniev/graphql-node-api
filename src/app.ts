import * as express from 'express';
import schema from './graphql/schema';
import db from './models';
import graphqlHTTP = require('express-graphql')
import { extracJwtMiddleware } from './middlewares/extract-jwt-middleware';

class App {
    public express: express.Application

    constructor(){
        this.express = express()
        this.middleware()
    }

    private middleware(): void{
        this.express.use('/graphql', 
        
        extracJwtMiddleware(),

        (req, res, next) => {
            req['context'].db = db
            next()
        },

        graphqlHTTP((req) => ({
            schema: schema,
            graphiql: process.env.NODE_ENV === 'development',
            context: req['context']
        })))
    }
}

export default new App().express