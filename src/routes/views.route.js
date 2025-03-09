import { Router } from "express";

const route = Router();

route.get("/", async (req, res) => {
    res.render("home")
})


route.get("/products", async (req, res) => {
    res.render("products")
})

route.get("/cart/:cid", async (req, res) => {
    const { cid } = req.params
    res.render("carts", { cid })
})

export default route;
