import mongoose, { model, Schema } from "mongoose"

const cartSchema = new Schema({
    products: {
        type: [{
            quantity: {
                type: Number,
                default: 0,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }],
        default: [],
    },
})

const cartModel = model("carts", cartSchema)

export default cartModel