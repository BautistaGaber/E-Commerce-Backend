import { randomUUID } from "crypto";
import { productDao } from "../dao/index.js";

class ProductController {
  static getProducts = async (req, res) => {
    try {
      let { page = 1, limit = 10, sort, category, status } = req.query;

      const products = await productDao.getProduct(
        page,
        limit,
        sort,
        category,
        status
      );
      res.json(products);
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static getProductById = async (req, res) => {
    try {
      const id = req.params.id;
      const productsId = await productDao.getProductById(id);
      return res.json({ product });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static addProduct = async (req, res) => {
    try {
      const prod = req.body;
      prod.id = randomUUID();
      const products = await productDao.addProduct(prod);
      return res.json(products);
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static updateProduct = async (req, res) => {
    try {
      const productId = req.params.pid;
      const newProduct = req.body;
      const products = await productDao.updateProductById(
        productId,
        newProduct
      );
      return res.send({
        status: "success",
        products: products,
      });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const productId = req.params.pid;
      const products = await productDao.deleteProductById(productId);;
      return res.json(products);
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };
}

export { ProductController };
