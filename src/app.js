import express from 'express'
import ProductsRoute from './routes/products.route.js'
import CartsRoute from './routes/carts.route.js'
import handlebars from 'express-handlebars'
import path from 'node:path'
import ViewsRoute from './routes/views.route.js'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { prodManager } from './managers/product.manager.js'
 
const app = express()

const serverHttp = app.listen(8080, () => console.log("Servidor ON en el puerto 8080"))
const io = new Server(serverHttp)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static((path.join(process.cwd(), "src", "public"))))

app.engine("handlebars", handlebars.engine())
app.set("views", path.join(process.cwd(), "src", "views"))
app.set("view engine", "handlebars")
app.use("/", ViewsRoute)

app.use("/api/products", ProductsRoute)
app.use("/api/carts", CartsRoute)

io.on("connection", (socket) => {
    console.log("Nuevo dispositivo conectado => ", socket.id)

    socket.on("Add", async (data) => {
        try {
            await prodManager.create(data)
            const products = await prodManager.getAll()
            io.emit("Update", products)
        } catch(error) {
            console.log(error)
        }
    })

    socket.on("Delete", async (data) => {
        try {
            await prodManager.delete(data.id)
            const products = await prodManager.getAll()
            io.emit("Update", products)
            
        } catch(error) {
            console.log(error)
        }
    })
})








