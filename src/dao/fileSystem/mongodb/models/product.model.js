import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  category: { type: String, required: true, max: 100 },
  thumbnail: { type: String, required: true, max: 100 },
  stock: { type: Number, required: true },
  code: { type: String, required: true, max: 100 },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);

export default productModel;
