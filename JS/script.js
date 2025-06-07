// Product Data
const products = [
  {
    id: 1,
    name: 'MacBook Pro 13" M2',
    price: 3299,
    oldPrice: 3599,
    category: "laptop",
    image: "/assets/pc-macjpg.jpg",
    badge: "-8%",
    description:
      "MacBook Pro 13 pouces avec puce M2. Performance exceptionnelle, autonomie toute la journée et écran Retina magnifique.",
    specs: ["Processeur: Apple M2", "Mémoire: 8 GB RAM", "Stockage: 256 GB SSD", 'Écran: 13.3" Retina'],
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 2899,
    oldPrice: 3199,
    category: "smartphone",
    image: "/assets/iphone-15.jpg",
    badge: "-9%",
    description: "iPhone 15 Pro avec puce A17 Pro. Appareil photo professionnel et design en titane.",
    specs: ["Processeur: A17 Pro", "Stockage: 128 GB", 'Écran: 6.1" Super Retina XDR', "Appareil photo: 48 MP"],
  },
  {
    id: 3,
    name: "Dell XPS 13",
    price: 2499,
    oldPrice: 2799,
    category: "laptop",
    image: "/assets/dell.jpg",
    badge: "-11%",
    description: "Ultrabook Dell XPS 13 avec processeur Intel Core i7. Design premium et performances élevées.",
    specs: ["Processeur: Intel Core i7", "Mémoire: 16 GB RAM", "Stockage: 512 GB SSD", 'Écran: 13.4" FHD+'],
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    price: 2199,
    oldPrice: 2399,
    category: "smartphone",
    image: "/assets/s24.jpg",
    badge: "-8%",
    description: "Samsung Galaxy S24 avec intelligence artificielle intégrée. Appareil photo révolutionnaire.",
    specs: ["Processeur: Snapdragon 8 Gen 3", "Mémoire: 8 GB RAM", "Stockage: 256 GB", 'Écran: 6.2" Dynamic AMOLED'],
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: 599,
    oldPrice: 699,
    category: "accessoire",
    image: "/assets/kiit.jpg",
    badge: "-14%",
    description: "AirPods Pro de 2ème génération avec réduction de bruit active et audio spatial.",
    specs: ["Réduction de bruit active", "Audio spatial", "Autonomie: 6h + 24h", "Résistance à l'eau IPX4"],
  },
  {
    id: 6,
    name: "HP Pavilion Gaming",
    price: 1899,
    oldPrice: 2199,
    category: "laptop",
    image: "/assets/hp.jpg",
    badge: "-14%",
    description: "PC portable gaming HP Pavilion avec carte graphique dédiée. Parfait pour les jeux et le travail.",
    specs: ["Processeur: AMD Ryzen 5", "Mémoire: 8 GB RAM", "GPU: GTX 1650", 'Écran: 15.6" FHD'],
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    price: 799,
    oldPrice: 899,
    category: "accessoire",
    image: "/assets/casque.jpg",
    badge: "-11%",
    description: "Casque sans fil Sony avec réduction de bruit leader du marché. Qualité audio exceptionnelle.",
    specs: ["Réduction de bruit", "Autonomie: 30h", "Bluetooth 5.2", "Charge rapide"],
  },
  {
    id: 8,
    name: "iPad Air M2",
    price: 1599,
    oldPrice: 1799,
    category: "smartphone",
    image: "/assets/ipad.jpg",
    badge: "-11%",
    description: "iPad Air avec puce M2. Parfait pour la créativité et la productivité.",
    specs: ["Processeur: Apple M2", 'Écran: 10.9" Liquid Retina', "Stockage: 64 GB", "Compatible Apple Pencil"],
  },
]

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()

  // Check which page we're on and initialize accordingly
  if (document.getElementById("productGrid")) {
    loadProducts()
  }

  if (document.getElementById("cartItems")) {
    loadCartItems()
  }

  if (window.location.pathname.includes("product.html")) {
    loadProductDetail()
  }

  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Search functionality
  const searchInput = document.querySelector(".search-bar input")
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value)
      }
    })
  }

  // Cart icon click
  const cartIcon = document.querySelector(".cart-icon")
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html"
    })
  }
})

// Load products on homepage
function loadProducts(filter = "all") {
  const productGrid = document.getElementById("productGrid")
  if (!productGrid) return

  let filteredProducts = products
  if (filter !== "all") {
    filteredProducts = products.filter((product) => product.category === filter)
  }

  productGrid.innerHTML = ""

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productGrid.appendChild(productCard)
  })

  // Add animation
  productGrid.classList.add("fade-in")
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-price">
                <span class="current-price">${product.price} DT</span>
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice} DT</span>` : ""}
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Ajouter
                </button>
                <button class="quick-view" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `

  return card
}

// Filter products
function filterProducts(category) {
  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  event.target.classList.add("active")

  // Load filtered products
  loadProducts(category)
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showMessage("Produit ajouté au panier !", "success")

  // If user is logged in, also save to their profile
  const getCurrentUser = () => {
    return false
  } // Dummy function
  if (typeof getCurrentUser === "function" && getCurrentUser()) {
    // This would sync cart with user profile in a real application
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// View product detail
function viewProduct(productId) {
  localStorage.setItem("selectedProduct", productId)
  window.location.href = "product.html"
}

// Load product detail page
function loadProductDetail() {
  const productId = Number.parseInt(localStorage.getItem("selectedProduct")) || 1
  const product = products.find((p) => p.id === productId)

  if (!product) return

  // Update page content
  document.getElementById("productName").textContent = product.name
  document.getElementById("productCategory").textContent = getCategoryName(product.category)
  document.getElementById("productTitle").textContent = product.name
  document.getElementById("productPrice").textContent = `${product.price} DT`
  document.getElementById("productDescription").textContent = product.description
  document.getElementById("mainProductImage").src = product.image

  // Update specs
  const specsList = document.getElementById("productSpecs")
  specsList.innerHTML = ""
  product.specs.forEach((spec) => {
    const li = document.createElement("li")
    li.textContent = spec
    specsList.appendChild(li)
  })

  // Load related products
  loadRelatedProducts(product.category, product.id)
}

// Get category display name
function getCategoryName(category) {
  const categoryNames = {
    laptop: "Ordinateurs",
    smartphone: "Smartphones",
    accessoire: "Accessoires",
  }
  return categoryNames[category] || "Produits"
}

// Load related products
function loadRelatedProducts(category, excludeId) {
  const relatedGrid = document.getElementById("relatedProducts")
  if (!relatedGrid) return

  const relatedProducts = products.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4)

  relatedGrid.innerHTML = ""
  relatedProducts.forEach((product) => {
    const card = createProductCard(product)
    relatedGrid.appendChild(card)
  })
}

// Change main product image
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById("mainProductImage")
  mainImage.src = thumbnail.src
}

// Change quantity in product detail
function changeQuantity(change) {
  const quantityInput = document.getElementById("quantity")
  const currentValue = Number.parseInt(quantityInput.value)
  let newValue = currentValue + change

  if (newValue < 1) newValue = 1
  quantityInput.value = newValue
}

// Add to cart from product detail page
function addToCartFromProduct() {
  const productId = Number.parseInt(localStorage.getItem("selectedProduct"))
  const quantity = Number.parseInt(document.getElementById("quantity").value)
  const product = products.find((p) => p.id === productId)

  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showMessage(`${quantity} produit(s) ajouté(s) au panier !`, "success")
}

// Load cart items
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems")
  const emptyCart = document.getElementById("emptyCart")

  if (cart.length === 0) {
    cartItemsContainer.style.display = "none"
    emptyCart.style.display = "block"
    document.querySelector(".cart-summary").style.display = "none"
    return
  }

  cartItemsContainer.style.display = "block"
  emptyCart.style.display = "none"
  document.querySelector(".cart-summary").style.display = "block"

  cartItemsContainer.innerHTML = ""

  cart.forEach((item) => {
    const cartItem = createCartItem(item)
    cartItemsContainer.appendChild(cartItem)
  })

  updateCartSummary()
}

// Create cart item element
function createCartItem(item) {
  const cartItem = document.createElement("div")
  cartItem.className = "cart-item"
  cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
            <h3>${item.name}</h3>
            <p>Prix unitaire: ${item.price} DT</p>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
        </div>
        <div class="item-price">${item.price * item.quantity} DT</div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `

  return cartItem
}

// Update cart item quantity
function updateCartQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
    return
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
  showMessage("Produit retiré du panier", "success")
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 7 : 0
  const total = subtotal + shipping

  document.getElementById("subtotal").textContent = `${subtotal} DT`
  document.getElementById("shipping").textContent = `${shipping} DT`
  document.getElementById("total").textContent = `${total} DT`
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    showMessage("Votre panier est vide", "error")
    return
  }

  // Simulate checkout process
  showMessage("Redirection vers le paiement...", "success")

  setTimeout(() => {
    alert("Fonctionnalité de paiement non implémentée dans cette démo")
  }, 1500)
}

// Newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  if (email) {
    showMessage("Merci pour votre inscription à la newsletter !", "success")
    event.target.reset()
  }
}

// Contact form submission
function submitContactForm(event) {
  event.preventDefault()

  // Get form data
  const formData = new FormData(event.target)
  const data = Object.fromEntries(formData)

  // Basic validation
  if (!validateContactForm(data)) {
    return
  }

  // Simulate form submission
  showMessage("Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.", "success")
  event.target.reset()
  clearErrors()
}

// Validate contact form
function validateContactForm(data) {
  let isValid = true
  clearErrors()

  // Name validation
  if (!data.name || data.name.length < 2) {
    showError("nameError", "Le nom doit contenir au moins 2 caractères")
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    showError("emailError", "Veuillez entrer une adresse email valide")
    isValid = false
  }

  // Phone validation (optional but if provided, should be valid)
  if (data.phone && data.phone.length > 0) {
    const phoneRegex = /^[+]?[0-9\s\-$$$$]{8,}$/
    if (!phoneRegex.test(data.phone)) {
      showError("phoneError", "Veuillez entrer un numéro de téléphone valide")
      isValid = false
    }
  }

  // Subject validation
  if (!data.subject) {
    showError("subjectError", "Veuillez sélectionner un sujet")
    isValid = false
  }

  // Message validation
  if (!data.message || data.message.length < 10) {
    showError("messageError", "Le message doit contenir au moins 10 caractères")
    isValid = false
  }

  return isValid
}

// Show form error
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
  }
}

// Clear form errors
function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => {
    element.textContent = ""
  })
}

// Search functionality
function performSearch(query) {
  if (!query.trim()) return

  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()),
  )

  // If on homepage, filter products
  if (document.getElementById("productGrid")) {
    const productGrid = document.getElementById("productGrid")
    productGrid.innerHTML = ""

    if (searchResults.length === 0) {
      productGrid.innerHTML =
        '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">Aucun produit trouvé pour votre recherche.</p>'
    } else {
      searchResults.forEach((product) => {
        const card = createProductCard(product)
        productGrid.appendChild(card)
      })
    }
  } else {
    // Redirect to homepage with search results
    localStorage.setItem("searchQuery", query)
    window.location.href = "index.html"
  }
}

// Show message to user
function showMessage(message, type = "success") {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message")
  existingMessages.forEach((msg) => msg.remove())

  // Create new message
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message

  // Insert at top of main content
  const main = document.querySelector("main") || document.body
  main.insertBefore(messageDiv, main.firstChild)

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

// Utility function to format currency
function formatCurrency(amount) {
  return `${amount.toLocaleString()} DT`
}

// Smooth scroll for anchor links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href").startsWith("#")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      })
    }
  }
})

// Handle page visibility change (for cart updates)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCartCount()
  }
})

// Initialize tooltips and other interactive elements
function initializeInteractiveElements() {
  // Add hover effects to product cards
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
}

// Call initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeInteractiveElements)
