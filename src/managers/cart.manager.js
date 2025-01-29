import fs from "fs"
import { v4 as uuidv4 } from 'uuid'
import path from "path"
import { prodManager } from "./product.manager.js"

class CartManager {
    constructor(path) {
        this.path = path
    }

    async getAllCarts() {
        try{
            if(fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path)
                return JSON.parse(carts)
            } else return []
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async create() {
        try{
            const cart = {
                id: uuidv4(),
                products: []
            }
            const carts = await this.getAllCarts()
            carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async getById(id) {
        try{
            const carts = await this.getAllCarts()
            const cart = carts.find(cart => cart.id === id)
            if(!cart) throw new Error('Carrito no encontrado')
            return cart
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async saveProdToCart(cId, pId) {
        try{
            const prod = await prodManager.getById(pId)
            const carts = await this.getAllCarts()
            const cart = await this.getById(cId)

            const indexInCart = cart.products.findIndex(prod => prod.id === pId)

            if(indexInCart === -1) {
                cart.products.push({
                    id: pId,
                    quantity: 1
                })
            } else {
                cart.products[indexInCart].quantity++
            }

            const newCarts = carts.filter(c => c.id !== cId)
            newCarts.push(cart)

            await fs.promises.writeFile(this.path, JSON.stringify(newCarts))

            return cart
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

}

export const cartManager = new CartManager(path.join(process.cwd(), "src/datos/carts.json"))