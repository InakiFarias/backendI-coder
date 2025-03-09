const getProducts = async (page = 1, limit = 10) => {
    try {
        const response = await fetch(`http://localhost:8080/api/products?page=${page}&limit=${limit}`)
        const data = await response.json()
        return data 
    } catch(e) {
        console.log(e)
        return null
    }
}

const renderProducts = async (page = 1, limit = 10) => {
    const data = await getProducts(page, limit)
    const productContainer = document.getElementById("products-container")
    productContainer.innerHTML = ""

    if (!data || !data.payload || data.payload.length === 0) {
        productContainer.innerHTML = "<p>No hay productos disponibles</p>"
        document.getElementById("pagination-container").innerHTML = ""
    }

    data.payload.forEach(product => {
        const div = document.createElement("div")
        div.className = "products-list"
        div.innerHTML = `
            <div class="product-card">
                <h3>${product.title}</h3>
                <img src="${product.thumbnail}" alt="${product.title}">
                <p>$${product.price}</p>
            </div>
        `

        const addButton = document.createElement("button")
        addButton.textContent = "Agregar al carrito"
        addButton.className = "product-button"
        addButton.id = product._id
        addButton.addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/cart/67c2f8bacff9af92976510c1/product/${product._id}`, {
                    method: "POST",
                })

                if (!response.ok) throw new Error("Error al agregar el producto al carrito")

                Toastify({
                    text: `${product.title} agregado al carrito 🛒`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #ff4b5c, #7a1c26)",
                    close: true
                }).showToast()
            } catch(error) {
                Toastify({
                    text: `❌ No se pudo agregar el producto: ${error.message}`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #ff4b5c, #7a1c26)",
                    close: true
                }).showToast()
            }    
        })

        div.querySelector(".product-card").appendChild(addButton)
        productContainer.appendChild(div)
    })

    renderPagination(data)
}

const renderPagination = (data) => {
    const paginationContainer = document.getElementById("pagination-container")
    paginationContainer.innerHTML = ""

    if (data.hasPrevPage) {
        const prevButton = document.createElement("button")
        prevButton.textContent = "Anterior"
        prevButton.addEventListener("click", () => {
            renderProducts(data.prevPage)
        })
        paginationContainer.appendChild(prevButton)
    }

    const pageInfo = document.createElement("span")
    pageInfo.textContent = ` Página ${data.page} de ${data.totalPages} `
    paginationContainer.appendChild(pageInfo)

    if (data.hasNextPage) {
        const nextButton = document.createElement("button")
        nextButton.textContent = "Siguiente"
        nextButton.addEventListener("click", () => {
            renderProducts(data.nextPage)
        })
        paginationContainer.appendChild(nextButton)
    }
}

renderProducts()