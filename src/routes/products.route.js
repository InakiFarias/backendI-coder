import { Router } from 'express'
import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import { prodManager } from '../managers/product.manager.js'

const route = Router()

route.get("", async (req, res) => {
    try{
        const { limit } = req.query
        const products = await prodManager.getAll()
    
        if(!limit) {
            return res.json(products)
        }
    
        const limitNumber = parseInt(limit, 10)

        if(isNaN(limitNumber) || limitNumber < 1) {
            return res.status(500).json({error: "El parametro 'limit' debe ser un numero mayor a 0"})
        }
    
        res.json(products.slice(0, limitNumber))
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

route.get("/:pId", async (req, res) => {
    try {
        const { pId } = req.params
        const product = await prodManager.getById(pId)
        res.json(product)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

route.post("", async (req, res) => {
    try{
        const product = await prodManager.create(req.body)
        res.json(product)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

route.put("/:pId", async (req, res) => {
    try{
        const { pId } = req.params

        const product = await prodManager.update(req.body, pId)
    
        res.json(product)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

route.delete("/:pId", async (req, res) => {
    try{
        const { pId } = req.params
        const product = await prodManager.delete(pId)
        res.json(product)
    } catch(error) {
        res.status(500).json({message: error.message})
    } 
})


export default route 