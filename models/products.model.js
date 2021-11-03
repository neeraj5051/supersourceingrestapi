

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Products', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.INTEGER,
        brand: DataTypes.INTEGER,
        status: DataTypes.INTEGER
    }, {
        tableName: 'products',
        underscored: true
    });

    Model.associate = function (models) {
        this.UserProduct = this.hasMany(models.UserProduct, {
            foreignKey: 'product_id',
        });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};