import { model, Schema } from "mongoose";
import moongosepaginte from "mongoose-paginate-v2";

const productSchema = new Schema({
    "title": String,
    "description": String,
    "price": Number,
    "thumbnail": String,
    "code": Number,
    "stock": Number,
});

productSchema.plugin(moongosepaginte);

const productModel = model("products", productSchema);

export default productModel;
