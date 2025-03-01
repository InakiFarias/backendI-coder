import { Router } from "express"
import cartModel from "../models/cartModel.js"
import upload from "../utils/multer.js"

const route = Router()

route.post("/", async (req, res) => {
  const newCart = await cartModel.create({
    products: [],
  })

  res.status(201).json({ message: "Carrito creado con exito", cart: newCart })
})

route.get("/:cid", async (req, res) => {
  const { cid } = req.params

  const cart = await cartModel.findById(cid).populate("products.product")

  res.status(cart ? 200 : 404).json({ productList: cart?.products })
})

route.put("/:cid", async (req, res) => {
  const { cid } = req.params
  const products = req.body

  const cart = await cartModel.findById(cid)
  if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

  const newCart = {
    ...cart,
    products
  }

  const cartUpdated = await cartModel.findByIdAndUpdate(cid, newCart, {new: true}).populate("products.product")

  res.status(201).json({ message: "Productos cargados", cart: cartUpdated })
})
export default route
