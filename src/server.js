import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars"
import path from "node:path";
import ProductsRoute from "./routes/products.route.js";
import CartsRoute from "./routes/carts.route.js";
import ViewsRoute from "./routes/views.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.listen(8080, () => console.log("Servidor ON en el puerto 8080"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));

app.engine("handlebars", engine());
app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "handlebars");

app.use("/", ViewsRoute);
app.use("/api/products", ProductsRoute);
app.use("/api/cart", CartsRoute);

mongoose.connect(process.env.DB_CONNECTION);
console.log("DB connected");
