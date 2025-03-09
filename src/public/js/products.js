const response = await fetch("http://localhost:8080/api/products")
const { payload } = await response.json()

const productContainer = document.getElementById("products-container")

payload.forEach(product => {
    const div = document.createElement("div")
    
    div.className = "products-list"
    div.innerHTML = `
        <div class="product-card">
            <h3>${product.title}</h3>
            <img src=${product.thumbnail} alt="${product.title}">
            <p>$${product.price}</p>
        </div>
    `
    const addButton = document.createElement("button")
    addButton.textContent = "Agregar al carrito"
    addButton.className = "product-button"
    addButton.id = product._id
    addButton.addEventListener("click", async (e) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/67c2f8bacff9af92976510c1/product/${product._id}`, {
                method: "POST",
            })

            if (!response.ok) throw new Error("Error al agregar el producto al carrito")

            alert(`${product.title} agregado al carrito`)
        } catch (error) {
            alert(`No se pudo agregar el producto: ${error.message}`)
        }    
    })

    div.querySelector(".product-card").appendChild(addButton);

    productContainer.appendChild(div)
})

