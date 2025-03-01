import { Router } from "express"
import cartModel from "../models/cartModel.js"
import productModel from "../models/productModel.js"

const route = Router()

route.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({
      products: [],
    })
  
    res.status(201).json({ message: "Carrito creado con exito", cart: newCart })
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

route.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params

    const cart = await cartModel.findById(cid).populate("products.product")

    res.status(cart ? 200 : 404).json({ productList: cart?.products })
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

route.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params
    const products = req.body

    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Formato de productos invalido. Debe ser un array." })
    }

    const cart = await cartModel.findById(cid)
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" })

    cart.products = products

    await cart.save()

    const cartUpdated = await cartModel.findById(cid).populate("products.product")

    res.status(200).json({ message: "Productos cargados", cart: cartUpdated })
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

route.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params

    const cart = await cartModel.findById(cid)
    if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

    const product = await productModel.findById(pid)
    if(!product) return res.status(404).json({ message: "Producto no existe"})

    const indexProd = cart.products.findIndex(prod => prod.product.toString() === pid)
    if(indexProd === -1) {
      cart.products.push({ product: pid, quantity: 1})
    } else {
      cart.products[indexProd].quantity++
    }

    await cart.save()

    const cartUpdated = await cartModel.findById(cid).populate("products.product")

    res.status(201).json({ message: "Producto agregado", cart: cartUpdated })
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

route.put("/:cid/product/:pid", async (req, res) => {
  try {
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

    await cart.save()

    const cartUpdated = await cartModel.findById(cid).populate("products.product")

    res.status(200).json({ message: "Cantidad actualizada", cart: cartUpdated })
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

route.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params

    const cart = await cartModel.findById(cid)
    if(!cart) return res.status(404).json({ message: "Carrito no encontrado"})

    cart.products = cart.products.filter(prod => prod.product.toString() !== pid)

    await cart.save()

    const cartUpdated = await cartModel.findById(cid).populate("products.product")

    res.status(201).json( {message: "Producto eliminado", cart: cartUpdated} )
  } catch(e) {
    res.status(500).json({ error: e })
  }
})

export default route
