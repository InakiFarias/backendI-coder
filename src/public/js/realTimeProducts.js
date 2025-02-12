const socket = io()

const buttonAdd = document.getElementById("add-button")
const buttonDelete = document.getElementById("delete-button")

const titleInput = document.getElementById("titulo");
const descriptionInput = document.getElementById("descripcion");
const codeInput = document.getElementById("codigo");
const priceInput = document.getElementById("precio");
const categoryInput = document.getElementById("categoria");

const inputId = document.getElementById("id_producto")

buttonAdd.addEventListener("click", (event) => {
    event.preventDefault()

    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()
    const code = codeInput.value.trim()
    const price = parseFloat(priceInput.value)
    const category = categoryInput.value.trim()
    const status = true

    if (!title || !description || !code || isNaN(price) || !category) {
        alert("Todos los campos son obligatorios y el precio debe ser un número válido.")
        return
    }

    socket.emit("Add", { title, description, code, price, category, status })

    titleInput.value = ""
    descriptionInput.value = ""
    codeInput.value = ""
    priceInput.value = ""
    categoryInput.value = ""
})

buttonDelete.addEventListener("click", (event) => {
    event.preventDefault()

    const idProduct = inputId.value.trim()

    if(!idProduct) alert("Id requerido para eliminar producto")

    socket.emit("Delete", { id: idProduct }) 
})

socket.on("Update", (products) => {
    const productsList = document.querySelector("#products-list")
    productsList.innerHTML = ""
    products.forEach(product => {
        const div = document.createElement("div")
        const titulo = document.createElement("h3")
        const price = document.createElement("p")

        titulo.textContent = product.title
        price.textContent = "$" + product.price

        div.appendChild(titulo)
        div.appendChild(price)

        div.classList.add("product-card") 

        productsList.appendChild(div)
    });
})


