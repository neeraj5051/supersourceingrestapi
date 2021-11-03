
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('UserProduct', {
        user_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,

    }, {
        tableName: 'user_product',
        underscored: true,
        timestamps: false
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};