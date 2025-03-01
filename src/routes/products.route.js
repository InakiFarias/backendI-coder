import { Router } from "express"
import productModel from "../models/productModel.js"
import upload from "../utils/multer.js"

const route = Router()

route.post("/", upload.single("file"), async (req, res) => {
  const { title, description, price, code, stock } = req.body
  if (!req.file || !title || !description || !price || !code || !stock)  
    return res.status(402).json({ message: "Deben cargarse todos los campos correctamente" })

  const result = await productModel.create({
    title,
    description, 
    price,
    thumbnail: req.file.path.split("public")[1],
    code, 
    stock,
  })

  res.status(201).json({ payload: result})
})

route.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort = "", ...query } = req.query
  const sortManager = {
    "asc": 1,
    "desc": -1,
  }

  const products = await productModel.paginate(
    { ...query },
    {
      limit,
      page,
      ...(sort && { sort: {price: sortManager[sort]} }),
      customLabels: { docs: 'payload'},
    },
  )

  res.json({
    ...products,
    status: "success",
  })
})

route.get("/:id", async (req, res) => {
  const { id } = req.params

  const product = await productModel.findById(id)

  if(product)
    res.status(200).json({ payload: product })
  else
    res.status(404).json({ error: "No se encontro el producto" })
})

route.put("/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params
  const product = req.body

  const productUpdated = await productModel.findByIdAndUpdate(id, {
    ...product,
    ...(req?.file?.path && {thumbnail: req.file.path}),
  }, { new: true })

  res.status(201).json({ message: "Producto actualizado correctamente", payload: productUpdated })
})

route.delete("/:id", async (req, res) => {
  const { id } = req.params

  const prodDelete = await productModel.findByIdAndDelete(id)

  res.status(prodDelete ? 200 : 404).json({ payload: prodDelete })
})

export default route