import { Router } from "express"
import path from "path"
import fs from "fs"

const route = Router()

route.get("/", async (req, res) => {
    try {
        let products = []
        if(fs.existsSync(path.join(process.cwd(), "src/datos/products.json"))) {
            products = await fs.promises.readFile(path.join(process.cwd(), "src/datos/products.json"))
            products = JSON.parse(products)
        }
        res.render("home", { products })
    } catch (error) {
        throw new Error(error.message)
    }   
})

route.get("/realTimeProducts", async (req, res) => {
    try {
        let products = []
        if(fs.existsSync(path.join(process.cwd(), "src/datos/products.json"))) {
            products = await fs.promises.readFile(path.join(process.cwd(), "src/datos/products.json"))
            products = JSON.parse(products)
        }
        res.render("realTimeProducts", { products })
    } catch (error) {
        throw new Error(error.message)
    }   
})

export default route 