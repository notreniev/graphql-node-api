"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const schema_1 = require("./graphql/schema");
const graphqlHTTP = require("express-graphql");
class App {
    constructor() {
        this.express = express();
        this.middleware();
    }
    middleware() {
        this.express.use('/graphql', graphqlHTTP({
            schema: schema_1.default,
            graphiql: process.env.NODE_ENV === 'development'
        }));
    }
}
exports.default = new App().express;
