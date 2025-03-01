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

route.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params

  const cart = await cartModel.findById(cid)
  if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

  const indexProd = cart.products.findIndex(prod => prod.product.toString() === pid)
  if(indexProd === -1) {
    cart.products.push({ product: pid, quantity: 1})
  } else {
    cart.products[indexProd].quantity++
  }

  const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { new: true }).populate("products.product")

  res.status(201).json({ message: "Producto agregado", cart: cartUpdated })
})

route.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Cantidad inválida" })
  }

  const cart = await cartModel.findById(cid)
  if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

  const indexProd = cart.products.findIndex(prod => prod.product.toString() === pid)
  if(indexProd === -1) {
      return res.status(404).json({ message: "Producto no encontrado" })
  } else {
    cart.products[indexProd].quantity = quantity
  }

  const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { new: true }).populate("products.product")

  res.status(201).json({ message: "Cantidad actualizada", cart: cartUpdated })
})

route.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params

  const cart = await cartModel.findById(cid)
  if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

  cart.products = cart.products.filter(prod => prod.product.toString() !== pid)

  await cart.save()

  const cartUpdated = await cartModel.findById(cid).populate("products.product")

  res.status(201).json( {message: "Producto eliminado", cart: cartUpdated} )
})

export default route
