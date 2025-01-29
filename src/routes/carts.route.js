import { Router } from 'express'
import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import { cartManager } from '../managers/cart.manager.js'

const route = Router()

route.post('', async (req, res) => {
    try{
        const cart = await cartManager.create()
        res.json(cart)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

route.get('/:cId', async (req, res) => {
    try{
        const { cId } = req.params
        const cart = await cartManager.getById(cId)
        res.json(cart.products)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

route.post('/:cId/product/:pId', async (req, res) => {
    try{
        const { cId, pId } = req.params
        const cart = await cartManager.saveProdToCart(cId, pId)
        res.json(cart)        
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

export default route