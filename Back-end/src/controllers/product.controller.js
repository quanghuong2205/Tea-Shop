'use strict';
const { OK, CREATED } = require('../utils/success.response.util');
const CODES = require('../utils/code.http');
const ProductServices = require('../services/product.service');
const { BadRequestError } = require('../utils/error.response.util');
const MulterServices = require('../services/multer.service');

/* Define the controller */
class ProductController {
    /**
     * @route [POST] /product
     */
    static async createProduct(req, res, next) {
        const relativePaths = await MulterServices.uploadMany({
            req,
            res,
            context: 'product',
        });

        if (!req.body?.category) {
            throw new BadRequestError({
                message: 'Not provide the category of the product',
                code: CODES.PRODUCT_CREATION_MISS_CATEGORY,
            });
        }

        return new CREATED({
            message: 'Created the product successfully',
            body: await ProductServices.createProduct({
                category: req.body.category,
                productProps: req.body,
                req,
                relativePaths,
            }),
        }).sendResponse(res);
    }

    /**
     * @route [DELETE] /product/:id
     */
    static async deleteProduct(req, res, next) {
        if (!req.params?.id) {
            throw new BadRequestError({
                message: 'Not provide the id of the product',
                code: CODES.PRODUCT_MISS_ID,
            });
        }

        const body = await ProductServices.deleteProduct({
            productID: req.params.id,
        });

        return new OK({
            message: 'Deleted the product successfully',
            body,
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [PATCH] /product/:id
     */
    static async updateProduct(req, res, next) {
        if (!req.params?.id) {
            throw new BadRequestError({
                message: 'Not provide the id of the product',
                code: CODES.PRODUCT_MISS_ID,
            });
        }

        /* Upload product's thumbs */
        const relativePaths = await MulterServices.uploadMany({
            req,
            res,
            context: 'product',
        });

        const body = await ProductServices.updateProduct({
            productID: req.params.id,
            relativePaths,
            productProps: req.body,
        });

        return new OK({
            message: 'Updated the product successfully',
            body,
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [GET] /product/publish
     * @returns
     */
    static async getPublishedProducts(req, res, next) {
        return new OK({
            message: 'Got all published products successfully',
            body: await ProductServices.getPublishedProducts({
                filterParams: req.query,
                page: req.query?.page,
                limit: req.query?.limit,
            }),
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [GET] /product/draft
     * @returns
     */
    static async getDraftProducts(req, res, next) {
        return new OK({
            message: 'Got all draft products successfully',
            body: await ProductServices.getDraftProducts({
                filterParams: req.query,
                page: req.query?.page,
                limit: req.query?.limit,
            }),
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [GET] /product/category/
     * @returns
     */
    static async getPublishedProductsByCat(req, res, next) {
        if (!req.params?.cat) {
            throw new BadRequestError({
                message: 'Not provide the category of products',
            });
        }

        return new OK({
            message: 'Got all products by category successfully',
            body: await ProductServices.getPublishedProductsByCat({
                category: req.params.cat,
            }),
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [GET] /product/:id
     */
    static async getPublishedProduct(req, res, next) {
        if (!req.params?.id) {
            throw new BadRequestError({
                message: 'Not provide the id of the product',
                code: CODES.PRODUCT_MISS_ID,
            });
        }

        return new OK({
            message: 'Got the product successfully',
            body: await ProductServices.getPublishedProduct({
                productID: req.params.id,
            }),
            code: CODES.OK,
        }).sendResponse(res);
    }

    /**
     * @route [GET] /product/:id
     */
    static async getDraftProduct(req, res, next) {
        if (!req.params?.id) {
            throw new BadRequestError({
                message: 'Not provide the id of the product',
                code: CODES.PRODUCT_MISS_ID,
            });
        }

        return new OK({
            message: 'Got the product successfully',
            body: await ProductServices.getDrafProduct({
                productID: req.params.id,
            }),
            code: CODES.OK,
        }).sendResponse(res);
    }
}

/* Export the controller */
module.exports = ProductController;