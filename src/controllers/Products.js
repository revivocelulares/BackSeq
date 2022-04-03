const { Sequelize, Op } = require('sequelize');
const { Products, Category, Collection } = require('../db.js');

const deleteProduct = async (id) => {
    try {
        eliminado = await Products.update(
            { sdelete: true }, {
            where: {
                id_product: id
            }
        })
        return eliminado[0] === 0
            ? { msg: 'No se encontro para eliminar.' }
            : eliminado[0];
    } catch (error) {
        console.log(error);
    }
}
const updateProducts = async ({ updatedProduct, productCategories }) => {
    try {
        actualizacion = await Products.update(
            updatedProduct, {
            where: {
                id_product: updatedProduct.id_product
            }
        })
        let actualizado = await Products.findByPk(updatedProduct.id_product)
        productCategories.map(category => {
            const category = await Category.findOne({
                where: { name: category }
            });
            actualizado.addCategory(category);
        })
        return actualizado[0] === 0
            ? { msg: 'No se encontro para actualizar.' }
            : actualizado;
    } catch (error) {
        console.log(error);
    }
}
const getProductDetails = async (id) => {
    try {
        const details = await Products.findByPk(id
            ,
            {
                include: [{
                    model: Category,
                    through: {
                        attributes: []
                    }
                }]
            }
        );
        return details === null
            ? { msg: 'No se encontro producto con ese Id.' }
            : details;
    } catch (error) {
        console.log(error);
    }
}
const getAllProducts = async () => {
    try {
        let hasData = await Products.findAll();
        return !hasData.length
            ? { msg: 'Esta vacia la tabla.' }
            : hasData;
    } catch (error) {
        console.log(error);
    }
}
const getProductByName = async (name) => {
    try {
        const response = await Products.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        })
        return !response.length
            ? { msg: 'Product not found.' }
            : response;
    } catch (error) {
        console.log(error);
    }
}
const getByCategory = async (id) => {
    const details = await Category.findByPk(
        id,
        {
            include: [{
                model: Products,
                through: {
                    attributes: []
                }
            }]
        }
    );
    return details
}
const getByCollection = async (id) => {
    const details = await Collection.findByPk(
        id,
        {
            include: [{
                model: Products,
                through: {
                    attributes: []
                }
            }]
        }
    );
    return details
}
const createProduct = async (prop) => {
    const { product, categories, collections } = prop
    const { id_product, name, authorized_refund, price, description, brand, is_offer, variants, sdelete, default_image } = product
    try {
        const newProduct = await Products.create({
            id_product, 
            name, 
            authorized_refund, price, 
            description, 
            brand, 
            is_offer,
            variants, 
            sdelete, 
            default_image
        });
        categories.map(async e => {
            const eDB = await Category.findAll({
                where: { name: e }
            })
            newProduct.addCategory(eDB);
        });
        return { "status": 201, "message": "Product has been created correctly.", "data": newProduct };
    } catch (error) {
        return error.data
    }
}
module.exports = {
    getProductDetails,
    getAllProducts,
    getProductByName,
    getByCategory,
    getByCollection,
    createProduct
};