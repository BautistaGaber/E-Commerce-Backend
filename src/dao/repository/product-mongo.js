import productModel from "../fileSystem/mongodb/models/product.model.js";

class ProductMongo {
  constructor() {
    this.model = productModel;
  }

  async getProduct(limit, page, sort, category, status) {
    try {
      const queryOptions = {};
      if (category) {
        queryOptions.category = category;
      }
      if (status === "avaliable") {
        queryOptions.stock = { $gt: 0 };
      } else if (status === "unavailable") {
        queryOptions.stock = { $eq: 0 };
      }
      return await this.model.paginate(queryOptions, {
        limit: limit,
        page: page ?? 1,
        sort: sort
          ? { price: sort === "desc" ? -1 : sort === "asc" ? 1 : 0 }
          : undefined,
        lean: true,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async addProduct(product) {
    try {
      if (
        product.title === undefined ||
        product.description === undefined ||
        product.code === undefined ||
        product.price === undefined ||
        product.stock === undefined ||
        product.category === undefined
      ) {
        throw new Error("Missing fields");
      }
      return await productModel.create(product);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateProductById(productId, newProduct) {
    try {
      if (
        newProduct.title === undefined ||
        newProduct.description === undefined ||
        newProduct.code === undefined ||
        newProduct.price === undefined ||
        newProduct.stock === undefined ||
        newProduct.category === undefined
      ) {
        throw new Error("Missing fields");
      }
      const result = await productModel.updateOne(
        { _id: productId },
        { $set: newProduct }
      );
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteProductById(productId) {
    try {
      const result = await productModel.findByIdAndDelete(productId);
      if (!result) {
        throw new Error("Product not found");
      }
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export { ProductMongo };
