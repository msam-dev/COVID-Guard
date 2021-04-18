const mongoose = require("mongoose");

function autoPopulateField(schema, field){
    const autoPopulate = function (next) {
        this.populate(field);
        next();
    };

    schema.
    pre('findOne', autoPopulate).
    pre('find', autoPopulate);
}

// use this version so that virtuals and methods are also inherited
function extendSchema (Schema, definition, options) {
    let newSchema = new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    );
    newSchema.virtuals = Schema.virtuals;
    newSchema.methods = Schema.methods;
    return newSchema;
}

module.exports = {autoPopulateField, extendSchema};