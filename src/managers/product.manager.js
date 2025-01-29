import fs from "fs"
import { v4 as uuidv4 } from 'uuid'
import path from "path"

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getAll() {
        try {
            if(fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path)
                return JSON.parse(products)
            } else return []
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getById(id) {
        try{
            const products = await this.getAll()
            const product = products.find(product => product.id === id)
            if(!product) throw new Error("Producto no encontrado")
            return product
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async create(obj) {
        try{
            const product = {
                id: uuidv4(),
                ...obj
            }
            const products = await this.getAll()
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return product
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async update(obj, id) {
        try{
            const products = await this.getAll()
            let product = await this.getById(id)
            
            if(!product) throw new Error('Producto no encontrado')
            
            product = {...product, ...obj}
            const newProducts = products.filter(prod => prod.id !== id)
            newProducts.push(product)

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
            return product
        } catch(error) {
            throw new Error(error.message)
        }
    }

    async delete(id) {
        try{
            const products = await this.getAll()
            const product = await this.getById(id)

            if(!product) throw new Error('Producto no encontrado')

            const newProducts = products.filter(prod => prod.id !== id)

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
            return product
        } catch(error) {
            throw new Error(error.message)
        }
    }

}

export const prodManager = new ProductManager(path.join(process.cwd(), "src/datos/products.json"))