function autoPopulateField(schema, field){
    const autoPopulate = function (next) {
        this.populate(field);
        next();
    };

    schema.
    pre('findOne', autoPopulate).
    pre('find', autoPopulate);
}

module.exports = {autoPopulateField};