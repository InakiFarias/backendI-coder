document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.getElementById("cart-container")
    const cartId = cartContainer.getAttribute("data-cart-id")

    if (!cartId) {
        console.error("Error: No se encontró el ID del carrito.")
        cartContainer.innerHTML = "<p>⚠ No se encontró el carrito.</p>"
        return
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/${cartId}`)
        const data = await response.json()

        if (!data.productList || data.productList.length === 0) {
            cartContainer.innerHTML = "<p>Carrito vacío.</p>"
            return
        }

        cartContainer.innerHTML = ""

        data.productList.forEach(product => {
            const div = document.createElement("div")
            div.className = "cart-item"

            div.innerHTML = `
                <h3>${product.product.title}</h3>
                <img src="${product.product.thumbnail}" alt="${product.product.title}">
                <p>Precio: $${product.product.price}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button class="remove-from-cart" data-id="${product.product._id}">Eliminar</button>
            `

            div.querySelector(".remove-from-cart").addEventListener("click", async () => {
                await fetch(`http://localhost:8080/api/cart/${cartId}/product/${product.product._id}`, {
                    method: "DELETE",
                })

                alert(`Producto eliminado: ${product.product.title}`)
                window.location.reload()
            })

            cartContainer.appendChild(div);
        })

    } catch (error) {
        console.error("Error al obtener el carrito:", error)
        cartContainer.innerHTML = "<p>Error al cargar el carrito.</p>"
    }
})