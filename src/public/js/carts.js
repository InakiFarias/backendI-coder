document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.getElementById("cart-container")
    const cartId = cartContainer.getAttribute("data-cart-id")

    if (!cartId) {
        console.error("Error: No se encontró el ID del carrito.")
        cartContainer.innerHTML = "<p>No se encontró el carrito.</p>"
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
                try {
                    const response = await fetch(`http://localhost:8080/api/cart/${cartId}/product/${product.product._id}`, {
                        method: "DELETE",
                    })
    
                    if (!response.ok) throw new Error("No se pudo eliminar el producto")
    
                    Toastify({
                        text: "🗑️ Producto eliminado del carrito",
                        duration: 3000,
                        gravity: "bottom", 
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #ff4b5c, #7a1c26)", 
                        close: true
                    }).showToast()

                    div.remove()

                    if (document.querySelectorAll(".cart-item").length === 0) {
                        cartContainer.innerHTML = "<p>Carrito vacío.</p>"
                    }
                } catch(e) {
                    Toastify({
                        text: `❌ No se pudo eliminar: ${error.message}`,
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #ff4b5c, #7a1c26)", 
                        close: true
                    }).showToast()
                }
            })
            cartContainer.appendChild(div);
        })

    } catch (error) {
        console.error("Error al obtener el carrito:", error)
        cartContainer.innerHTML = "<p>Error al cargar el carrito.</p>"
    }
})