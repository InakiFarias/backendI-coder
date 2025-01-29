import express from 'express'
import ProductsRoute from './routes/products.route.js'
import CartsRoute from './routes/carts.route.js'
import fs from 'node:fs'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/products", ProductsRoute)
app.use("/api/carts", CartsRoute)



app.listen(8080, () => {
    console.log("Servidor ON en el puerto 8080")
})


