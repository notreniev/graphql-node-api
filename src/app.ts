import * as express from 'express';
import schema from './graphql/schema';
import db from './models';
import graphqlHTTP = require('express-graphql')

class App {
    public express: express.Application

    constructor(){
        this.express = express()
        this.middleware()
    }

    private middleware(): void{
        this.express.use('/graphql', 
        
        (req, res, next) => {
            req['context'] = {}
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