// Profile page functionality
const editMode = {}

// Mock data and functions (replace with actual data fetching)
const currentUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  birthDate: "1990-01-01",
  gender: "male",
  orders: [
    { id: 1, date: "2024-01-01", total: 100, items: [1, 2], status: "delivered" },
    { id: 2, date: "2024-01-15", total: 50, items: [3], status: "pending" },
  ],
  addresses: [
    {
      id: 1,
      title: "Home",
      firstName: "John",
      lastName: "Doe",
      street: "123 Main St",
      city: "Anytown",
      postal: "12345",
      phone: "123-456-7890",
      isDefault: true,
    },
    {
      id: 2,
      title: "Work",
      firstName: "John",
      lastName: "Doe",
      street: "456 Oak Ave",
      city: "Anytown",
      postal: "67890",
      isDefault: false,
    },
  ],
  wishlist: [
    { id: 1, name: "Product 1", price: 25, image: "placeholder.jpg" },
    { id: 2, name: "Product 2", price: 50, image: "placeholder.jpg" },
  ],
  password: "password123",
  notifications: {
    emailOrders: true,
    emailPromotions: false,
    emailNewsletter: true,
    smsOrders: false,
    smsDelivery: true,
  },
}

function getUserFullName() {
  return `${currentUser.firstName} ${currentUser.lastName}`
}

function updateUserData(data) {
  Object.assign(currentUser, data)
  localStorage.setItem("currentUser", JSON.stringify(currentUser)) // Simulate local storage
  return true
}

function showMessage(message, type = "info") {
  alert(`${type.toUpperCase()}: ${message}`) // Replace with actual UI notification
}

function addToCart(productId) {
  console.log(`Adding product ${productId} to cart`)
}

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    loadProfileData()

    // Handle URL hash for direct section access
    const hash = window.location.hash.substring(1)
    if (hash) {
      showSection(hash)
    }
  }
})

// Load user profile data
function loadProfileData() {
  if (!currentUser) return

  // Update profile card
  document.getElementById("profileName").textContent = getUserFullName()
  document.getElementById("profileEmail").textContent = currentUser.email

  // Update profile stats
  document.getElementById("totalOrders").textContent = currentUser.orders?.length || 0
  const totalSpent = currentUser.orders?.reduce((sum, order) => sum + order.total, 0) || 0
  document.getElementById("totalSpent").textContent = `${totalSpent} DT`

  // Load personal info form
  loadPersonalInfo()

  // Load other sections
  loadOrders()
  loadAddresses()
  loadWishlist()
}

// Load personal information
function loadPersonalInfo() {
  if (!currentUser) return

  document.getElementById("editFirstName").value = currentUser.firstName || ""
  document.getElementById("editLastName").value = currentUser.lastName || ""
  document.getElementById("editEmail").value = currentUser.email || ""
  document.getElementById("editPhone").value = currentUser.phone || ""
  document.getElementById("editBirthDate").value = currentUser.birthDate || ""
  document.getElementById("editGender").value = currentUser.gender || ""
}

// Show profile section
function showSection(sectionId) {
  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  document.querySelector(`[onclick="showSection('${sectionId}')"]`)?.classList.add("active")

  // Update content
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Update URL hash
  window.location.hash = sectionId
}

// Toggle edit mode for sections
function toggleEdit(sectionId) {
  const form = document.getElementById(`${sectionId}Form`)
  const inputs = form.querySelectorAll("input, select")
  const actions = form.querySelector(".form-actions")
  const editBtn = document.querySelector(`[onclick="toggleEdit('${sectionId}')"]`)

  editMode[sectionId] = !editMode[sectionId]

  if (editMode[sectionId]) {
    // Enable editing
    inputs.forEach((input) => {
      input.removeAttribute("readonly")
      input.removeAttribute("disabled")
    })
    actions.style.display = "flex"
    editBtn.innerHTML = '<i class="fas fa-times"></i> Annuler'
  } else {
    // Disable editing
    inputs.forEach((input) => {
      input.setAttribute("readonly", "readonly")
      if (input.tagName === "SELECT") {
        input.setAttribute("disabled", "disabled")
      }
    })
    actions.style.display = "none"
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Modifier'

    // Reload original data
    loadPersonalInfo()
  }
}

// Cancel edit mode
function cancelEdit(sectionId) {
  toggleEdit(sectionId)
}

// Update personal information
function updatePersonalInfo(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const userData = Object.fromEntries(formData)

  // Validate data
  if (!validatePersonalInfo(userData)) {
    return
  }

  // Update user data
  if (updateUserData(userData)) {
    showMessage("Informations mises à jour avec succès", "success")
    toggleEdit("personal-info")

    // Update header name
    const headerUserName = document.getElementById("headerUserName")
    if (headerUserName) {
      headerUserName.textContent = getUserFullName()
    }

    // Update profile card
    document.getElementById("profileName").textContent = getUserFullName()
  } else {
    showMessage("Erreur lors de la mise à jour", "error")
  }
}

// Validate personal information
function validatePersonalInfo(data) {
  let isValid = true

  if (!data.firstName || data.firstName.length < 2) {
    showMessage("Le prénom doit contenir au moins 2 caractères", "error")
    isValid = false
  }

  if (!data.lastName || data.lastName.length < 2) {
    showMessage("Le nom doit contenir au moins 2 caractères", "error")
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    showMessage("Veuillez entrer une adresse email valide", "error")
    isValid = false
  }

  return isValid
}

// Load orders
function loadOrders() {
  const ordersList = document.getElementById("ordersList")
  if (!ordersList || !currentUser) return

  const orders = currentUser.orders || []

  if (orders.length === 0) {
    ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3>Aucune commande</h3>
                <p>Vous n'avez pas encore passé de commande</p>
                <a href="index.html" class="continue-shopping">Commencer mes achats</a>
            </div>
        `
    return
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <div class="order-number">Commande #${order.id}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString("fr-FR")}</div>
                </div>
                <div class="order-status status-${order.status}">
                    ${getOrderStatusText(order.status)}
                </div>
            </div>
            <div class="order-details">
                <p><strong>Total:</strong> ${order.total} DT</p>
                <p><strong>Articles:</strong> ${order.items.length} produit(s)</p>
            </div>
            <div class="order-actions">
                <button onclick="viewOrderDetails(${order.id})" class="view-btn">
                    Voir les détails
                </button>
                ${
                  order.status === "delivered"
                    ? `
                    <button onclick="reorderItems(${order.id})" class="reorder-btn">
                        Recommander
                    </button>
                `
                    : ""
                }
            </div>
        </div>
    `,
    )
    .join("")
}

// Get order status text
function getOrderStatusText(status) {
  const statusTexts = {
    pending: "En attente",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  }
  return statusTexts[status] || status
}

// Filter orders
function filterOrders(status) {
  const orders = currentUser?.orders || []
  let filteredOrders = orders

  if (status !== "all") {
    filteredOrders = orders.filter((order) => order.status === status)
  }

  // Update display (simplified for demo)
  loadOrders()
}

// Load addresses
function loadAddresses() {
  const addressesList = document.getElementById("addressesList")
  if (!addressesList || !currentUser) return

  const addresses = currentUser.addresses || []

  if (addresses.length === 0) {
    addressesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3>Aucune adresse</h3>
                <p>Ajoutez une adresse pour faciliter vos commandes</p>
            </div>
        `
    return
  }

  addressesList.innerHTML = addresses
    .map(
      (address) => `
        <div class="address-card ${address.isDefault ? "default" : ""}">
            ${address.isDefault ? '<span class="default-badge">Par défaut</span>' : ""}
            <div class="address-title">${address.title}</div>
            <div class="address-name">${address.firstName} ${address.lastName}</div>
            <div class="address-street">${address.street}</div>
            <div class="address-city">${address.city}, ${address.postal}</div>
            ${address.phone ? `<div class="address-phone">${address.phone}</div>` : ""}
            <div class="address-actions">
                <button class="edit-address" onclick="editAddress(${address.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-address" onclick="deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Show add address modal
function showAddAddressModal() {
  const modal = document.getElementById("addAddressModal")
  if (modal) {
    modal.classList.add("active")

    // Pre-fill with user data
    document.getElementById("addressFirstName").value = currentUser.firstName
    document.getElementById("addressLastName").value = currentUser.lastName
  }
}

// Close add address modal
function closeAddAddressModal() {
  const modal = document.getElementById("addAddressModal")
  if (modal) {
    modal.classList.remove("active")
    modal.querySelector("form").reset()
  }
}

// Add new address
function addAddress(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const addressData = Object.fromEntries(formData)

  const newAddress = {
    id: Date.now(),
    title: addressData.addressTitle,
    firstName: addressData.addressFirstName,
    lastName: addressData.addressLastName,
    street: addressData.addressStreet,
    city: addressData.addressCity,
    postal: addressData.addressPostal,
    phone: addressData.addressPhone,
    isDefault: addressData.defaultAddress === "on",
  }

  // If this is set as default, remove default from others
  if (newAddress.isDefault) {
    currentUser.addresses?.forEach((addr) => (addr.isDefault = false))
  }

  // Add to user addresses
  if (!currentUser.addresses) currentUser.addresses = []
  currentUser.addresses.push(newAddress)

  // Update user data
  updateUserData({ addresses: currentUser.addresses })

  showMessage("Adresse ajoutée avec succès", "success")
  closeAddAddressModal()
  loadAddresses()
}

// Delete address
function deleteAddress(addressId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
    currentUser.addresses = currentUser.addresses.filter((addr) => addr.id !== addressId)
    updateUserData({ addresses: currentUser.addresses })
    showMessage("Adresse supprimée", "success")
    loadAddresses()
  }
}

// Load wishlist
function loadWishlist() {
  const wishlistItems = document.getElementById("wishlistItems")
  const wishlistCount = document.querySelector(".wishlist-count")

  if (!wishlistItems || !currentUser) return

  const wishlist = currentUser.wishlist || []

  if (wishlistCount) {
    wishlistCount.textContent = `${wishlist.length} produit${wishlist.length > 1 ? "s" : ""}`
  }

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3>Liste de souhaits vide</h3>
                <p>Ajoutez des produits à votre liste de souhaits</p>
                <a href="index.html" class="continue-shopping">Découvrir nos produits</a>
            </div>
        `
    return
  }

  wishlistItems.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-info">
                <h3>${item.name}</h3>
                <div class="wishlist-price">${item.price} DT</div>
                <div class="wishlist-actions">
                    <button class="add-to-cart-wishlist" onclick="addToCartFromWishlist(${item.id})">
                        Ajouter au panier
                    </button>
                    <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">
                        Retirer
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Add to cart from wishlist
function addToCartFromWishlist(productId) {
  addToCart(productId)
  showMessage("Produit ajouté au panier", "success")
}

// Remove from wishlist
function removeFromWishlist(productId) {
  currentUser.wishlist = currentUser.wishlist.filter((item) => item.id !== productId)
  updateUserData({ wishlist: currentUser.wishlist })
  showMessage("Produit retiré de la liste de souhaits", "success")
  loadWishlist()
}

// Show change password modal
function showChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal")
  if (modal) {
    modal.classList.add("active")
  }
}

// Close change password modal
function closeChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal")
  if (modal) {
    modal.classList.remove("active")
    modal.querySelector("form").reset()
  }
}

// Change password
function changePassword(event) {
  event.preventDefault()

  const currentPassword = document.getElementById("currentPassword").value
  const newPassword = document.getElementById("newPassword").value
  const confirmNewPassword = document.getElementById("confirmNewPassword").value

  // Validate current password
  if (currentPassword !== currentUser.password) {
    showMessage("Mot de passe actuel incorrect", "error")
    return
  }

  // Validate new password
  if (newPassword.length < 6) {
    showMessage("Le nouveau mot de passe doit contenir au moins 6 caractères", "error")
    return
  }

  // Validate password confirmation
  if (newPassword !== confirmNewPassword) {
    showMessage("Les nouveaux mots de passe ne correspondent pas", "error")
    return
  }

  // Update password
  updateUserData({ password: newPassword })
  showMessage("Mot de passe modifié avec succès", "success")
  closeChangePasswordModal()
}

// Update notifications preferences
function updateNotifications(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const notifications = {
    emailOrders: formData.get("emailOrders") === "on",
    emailPromotions: formData.get("emailPromotions") === "on",
    emailNewsletter: formData.get("emailNewsletter") === "on",
    smsOrders: formData.get("smsOrders") === "on",
    smsDelivery: formData.get("smsDelivery") === "on",
  }

  updateUserData({ notifications })
  showMessage("Préférences de notification mises à jour", "success")
}

// Change avatar (simulated)
function changeAvatar() {
  showMessage("Fonctionnalité de changement d'avatar non implémentée dans cette démo", "error")
}

// Show active sessions (simulated)
function showActiveSessions() {
  showMessage("Fonctionnalité de gestion des sessions non implémentée dans cette démo", "error")
}

// View order details (simulated)
function viewOrderDetails(orderId) {
  showMessage(`Détails de la commande #${orderId} - Fonctionnalité non implémentée dans cette démo`, "error")
}

// Reorder items (simulated)
function reorderItems(orderId) {
  showMessage("Produits ajoutés au panier", "success")
}

// Edit address (simulated)
function editAddress(addressId) {
  showMessage("Fonctionnalité d'édition d'adresse non implémentée dans cette démo", "error")
}

// Close modals when clicking outside
document.addEventListener("click", (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.classList.remove("active")
    }
  })
})
