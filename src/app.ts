import * as express from 'express';
import { RequestedFields } from './ast/RequestedFields';
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import schema from './graphql/schema';
import { extracJwtMiddleware } from './middlewares/extract-jwt-middleware';
import db from './models';
import graphqlHTTP = require('express-graphql')

class App {
    public express: express.Application
    private dataLoaderFactory: DataLoaderFactory
    private requestedFields: RequestedFields

    constructor() {
        this.express = express()
        this.init()
    }

    private init(): void {
        this.requestedFields = new RequestedFields()
        this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields)
        this.middleware()
    }

    private middleware(): void {
        this.express.use('/graphql',

            extracJwtMiddleware(),

            (req, res, next) => {
                req['context']['db'] = db
                req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders()
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