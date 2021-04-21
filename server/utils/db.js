const mongoose = require("mongoose");
const assert = require('chai').assert

function autoPopulateField(schema, field){
    const autoPopulate = function (next) {
        this.populate(field);
        next();
    };

    schema.
    pre('findOne', autoPopulate).
    pre('find', autoPopulate);
}


// use this version so that virtuals and methods etc are also inherited
function extendSchema (Schema, definition={}, options={}) {
    let newSchema = new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        Object.assign({}, Schema._userProvidedOptions, options)
    );
    newSchema.virtuals = Schema.virtuals;
    newSchema.methods = Schema.methods;
    newSchema.statics = Schema.statics;
    newSchema.query = Schema.query;
    newSchema.aliases = Schema.aliases;
    //newSchema.plugins = Schema.plugins; causing error for some users to not return id

    return newSchema;
}

module.exports = {autoPopulateField, extendSchema};