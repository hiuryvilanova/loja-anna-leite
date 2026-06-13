import products from './products.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- INICIALIZAÇÃO DE ÍCONES ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- CONFIGURAÇÃO E ESTADO ---
  let cart = JSON.parse(localStorage.getItem("anna_leite_cart")) || [];
  let activeCoupon = null; // Guarda { code: 'ANNA10', rate: 0.10 }
  const WHATSAPP_NUMBER = "5561981662282"; // Número da loja
  const MOCK_PIX_KEY = "00020126580014br.gov.bcb.pix0136annaleite.studio@pix.com.br5204000053039865406389.905802BR5915ANNA LEITE LTDA6009SAO PAULO62070503***6304D8C4";

  // --- ELEMENTOS DO DOM ---
  const productsContainer = document.getElementById("products-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchToggle = document.getElementById("search-toggle");
  const searchDrawer = document.getElementById("search-bar-drawer");
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  
  // Header scrolled effect
  const mainHeader = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  });

  // Mobile navigation
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const icon = menuToggle.querySelector("i");
    if (navMenu.classList.contains("open")) {
      icon.setAttribute("data-lucide", "x");
    } else {
      icon.setAttribute("data-lucide", "menu");
    }
    lucide.createIcons();
  });

  // Close mobile menu on click link
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      const icon = menuToggle.querySelector("i");
      icon.setAttribute("data-lucide", "menu");
      lucide.createIcons();
    });
  });

  // --- CART SIDEBAR CONTROLS ---
  const cartToggle = document.getElementById("cart-toggle");
  const cartClose = document.getElementById("cart-close");
  const cartSidebar = document.getElementById("cart-sidebar");

  cartToggle.addEventListener("click", () => cartSidebar.classList.add("open"));
  cartClose.addEventListener("click", () => cartSidebar.classList.remove("open"));

  // --- PRODUCT RENDERING ---
  function formatPrice(val) {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderCatalog(filter = "all", searchQuery = "") {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    let filtered = filter === "all" 
      ? products 
      : products.filter(p => p.category === filter);

    // Apply search filter
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) || 
        p.description.toLowerCase().includes(cleanQuery)
      );
    }

    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i data-lucide="info" style="width: 32px; height: 32px; margin-bottom: 12px; color: var(--primary-light); stroke-width: 1.5; display: inline-block;"></i>
          <p>Nenhum produto encontrado para "${searchQuery}".</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.cursor = "pointer";
      
      card.innerHTML = `
        <span class="product-badge">Premium</span>
        <div class="product-img-wrapper">
          <img src="${product.images[0]}" alt="${product.name}" class="product-img" loading="lazy">
          <div class="product-actions">
            <button class="card-btn add-to-cart-quick" data-id="${product.id}">
              <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i> Sacola
            </button>
            <button class="card-btn-icon quick-view" data-id="${product.id}" aria-label="Visualização rápida">
              <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-footer">
            <span class="product-price">${formatPrice(product.price)}</span>
            <div class="product-rating">
              <i data-lucide="star" style="width: 12px; height: 12px; fill: currentColor;"></i>
              <span>${product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      `;

      // Clique no card inteiro abre a visualização rápida (detalhes)
      card.addEventListener("click", (e) => {
        // Se o usuário clicar no botão "Sacola" ou em algum filho dele, não abre os detalhes
        if (e.target.closest(".add-to-cart-quick")) {
          return;
        }
        openQuickViewModal(product.id);
      });

      productsContainer.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Attach listeners
    productsContainer.querySelectorAll(".add-to-cart-quick").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(btn.getAttribute("data-id"));
        const prod = products.find(p => p.id === id);
        addToCart(id, prod.sizes[0], prod.colors[0].name);
        openCartSidebar();
      });
    });
  }

  // Filter switching
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Ao trocar de categoria, limpa o input e fecha a busca
      if (searchInput && searchDrawer) {
        searchInput.value = "";
        searchDrawer.classList.remove("open");
      }
      
      renderCatalog(btn.getAttribute("data-filter"));
    });
  });

  // Footer navigation connections
  document.querySelectorAll(".footer-links a[data-category]").forEach(link => {
    link.addEventListener("click", (e) => {
      const cat = link.getAttribute("data-category");
      const filterBtn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (filterBtn) {
        filterBtn.click();
      }
    });
  });

  // --- CART STATE MANAGEMENT ---
  function openCartSidebar() {
    cartSidebar.classList.add("open");
  }

  function addToCart(id, size, colorName) {
    const product = products.find(p => p.id === id);
    const existingIndex = cart.findIndex(item => 
      item.id === id && item.size === size && item.color === colorName
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      const colorObj = product.colors.find(c => c.name === colorName);
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size,
        color: colorName,
        colorHex: colorObj ? colorObj.hex : '#000',
        quantity: 1
      });
    }

    // Badge popup micro-animation
    const badge = document.getElementById("header-cart-count");
    if (badge) {
      badge.classList.remove("pop");
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add("pop");
    }

    updateCart();
  }

  function updateQuantity(id, size, color, delta) {
    const index = cart.findIndex(item => 
      item.id === id && item.size === size && item.color === color
    );
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      updateCart();
    }
  }

  function removeFromCart(id, size, color) {
    cart = cart.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    );
    updateCart();
  }

  function updateCart() {
    localStorage.setItem("anna_leite_cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    const container = document.getElementById("cart-items-container");
    const countBadge = document.getElementById("header-cart-count");
    const totalSpan = document.getElementById("cart-total-value");
    
    // Discount elements
    const discountRow = document.getElementById("discount-row");
    const discountSpan = document.getElementById("cart-discount-value");
    
    if (!container) return;
    container.innerHTML = "";

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadge.textContent = totalCount;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-message">
          <i data-lucide="shopping-bag"></i>
          <p>Sua sacola está vazia</p>
          <button class="btn btn-outline" style="margin-top: 20px; font-size: 11px; padding: 10px 24px;" id="continue-shopping">
            Continuar Compras
          </button>
        </div>
      `;
      totalSpan.textContent = formatPrice(0);
      if (discountRow) discountRow.style.display = "none";
      
      const continueBtn = document.getElementById("continue-shopping");
      if (continueBtn) {
        continueBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));
      }
      lucide.createIcons();
      return;
    }

    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-meta">
            Tam: ${item.size} | Cor: ${item.color}
          </div>
          <div class="cart-item-actions">
            <div class="qty-selector">
              <button class="qty-btn dec-qty" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}"><i data-lucide="minus" style="width: 10px; height: 10px;"></i></button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}"><i data-lucide="plus" style="width: 10px; height: 10px;"></i></button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">Excluir</button>
          </div>
        </div>
        <div class="cart-item-price" style="text-align: right; font-family: var(--font-body);">
          ${formatPrice(itemSubtotal)}
        </div>
      `;

      container.appendChild(itemDiv);
    });

    // Discount calculation
    let discount = 0;
    if (activeCoupon) {
      discount = subtotal * activeCoupon.rate;
      if (discountRow && discountSpan) {
        discountRow.style.display = "flex";
        discountSpan.textContent = `- ${formatPrice(discount)}`;
      }
    } else {
      if (discountRow) discountRow.style.display = "none";
    }

    const finalTotal = subtotal - discount;
    totalSpan.textContent = formatPrice(finalTotal);

    // Event listeners
    container.querySelectorAll(".dec-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const size = btn.getAttribute("data-size");
        const color = btn.getAttribute("data-color");
        updateQuantity(id, size, color, -1);
      });
    });

    container.querySelectorAll(".inc-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const size = btn.getAttribute("data-size");
        const color = btn.getAttribute("data-color");
        updateQuantity(id, size, color, 1);
      });
    });

    container.querySelectorAll(".remove-item-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const size = btn.getAttribute("data-size");
        const color = btn.getAttribute("data-color");
        removeFromCart(id, size, color);
      });
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- COUPON DISCOUNT INTERACTION ---
  const applyCouponBtn = document.getElementById("apply-coupon");
  const couponInput = document.getElementById("coupon-code");
  const couponFeedback = document.getElementById("coupon-feedback");

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "ANNA10") {
        activeCoupon = { code: "ANNA10", rate: 0.10 };
        if (couponFeedback) {
          couponFeedback.style.color = "var(--success)";
          couponFeedback.textContent = "Cupom ANNA10 (10% OFF) aplicado!";
        }
        updateCart();
      } else if (code === "") {
        activeCoupon = null;
        if (couponFeedback) couponFeedback.textContent = "";
        updateCart();
      } else {
        if (couponFeedback) {
          couponFeedback.style.color = "var(--error)";
          couponFeedback.textContent = "Cupom inválido.";
        }
      }
    });
  }

  // --- SIZE GUIDE MODAL CONTROLS ---
  const sizeGuideModal = document.getElementById("size-guide-modal");
  const sizeGuideClose = document.getElementById("size-guide-close");

  if (sizeGuideClose && sizeGuideModal) {
    sizeGuideClose.addEventListener("click", () => {
      sizeGuideModal.classList.remove("open");
    });
  }

  // --- PRODUCT DETAIL MODAL CONTROLS ---
  const productModal = document.getElementById("product-modal");
  const productModalClose = document.getElementById("product-modal-close");
  const productDetailContent = document.getElementById("product-detail-content");

  function openQuickViewModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0].name;

    productDetailContent.innerHTML = `
      <div class="product-detail-gallery">
        <img src="${product.images[0]}" alt="${product.name}" id="modal-main-img">
      </div>
      <div class="product-detail-info">
        <span class="product-category">${product.category}</span>
        <h2 class="product-detail-name">${product.name}</h2>
        <div class="product-detail-price">${formatPrice(product.price)}</div>
        <p class="product-detail-desc">${product.description}</p>
        
        <!-- Tamanho Selection -->
        <div class="product-detail-option">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="option-label">Tamanho</span>
            <span class="size-guide-link" id="trigger-size-guide"><i data-lucide="info" style="width: 12px; height: 12px;"></i> Guia de Medidas</span>
          </div>
          <div class="size-selector">
            ${product.sizes.map((s, idx) => `
              <button class="size-option ${idx === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>
        </div>
        
        <!-- Cor Selection -->
        <div class="product-detail-option">
          <span class="option-label">Cor: <span id="modal-color-name" style="font-weight: 500; text-transform: none; letter-spacing: normal;">${selectedColor}</span></span>
          <div class="color-selector">
            ${product.colors.map((c, idx) => `
              <button class="color-option ${idx === 0 ? 'active' : ''}" data-color="${c.name}" title="${c.name}">
                <span style="background-color: ${c.hex};"></span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <button class="btn btn-primary btn-full" id="modal-add-to-cart" style="margin-top: 15px;">
          Adicionar à Sacola
        </button>
        
        <ul class="product-details-list">
          ${product.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    `;

    productModal.classList.add("open");
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Connect trigger for size guide
    const triggerSizeGuide = productDetailContent.querySelector("#trigger-size-guide");
    if (triggerSizeGuide && sizeGuideModal) {
      triggerSizeGuide.addEventListener("click", () => {
        sizeGuideModal.classList.add("open");
      });
    }

    // Modal size options selection click handler
    const sizeBtns = productDetailContent.querySelectorAll(".size-option");
    sizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.getAttribute("data-size");
      });
    });

    // Modal color options selection click handler
    const colorBtns = productDetailContent.querySelectorAll(".color-option");
    const modalColorNameLabel = productDetailContent.querySelector("#modal-color-name");
    colorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        colorBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedColor = btn.getAttribute("data-color");
        modalColorNameLabel.textContent = selectedColor;
      });
    });

    // Modal addToCart logic
    const modalAddBtn = productDetailContent.querySelector("#modal-add-to-cart");
    modalAddBtn.addEventListener("click", () => {
      addToCart(product.id, selectedSize, selectedColor);
      productModal.classList.remove("open");
      openCartSidebar();
    });
  }

  productModalClose.addEventListener("click", () => {
    productModal.classList.remove("open");
  });

  // --- CHECKOUT MODAL & FORMS CONTROLS ---
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutModalClose = document.getElementById("checkout-modal-close");
  const checkoutTrigger = document.getElementById("checkout-trigger");
  
  const checkoutTotalValue = document.getElementById("checkout-total-value");
  const checkoutDiscountRow = document.getElementById("checkout-discount-row");
  const checkoutDiscountValue = document.getElementById("checkout-discount-value");
  
  const paymentTabs = document.querySelectorAll(".payment-tab");
  const paymentPanels = document.querySelectorAll(".payment-panel");

  checkoutTrigger.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    // Update Checkout values
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (activeCoupon) {
      discount = subtotal * activeCoupon.rate;
      if (checkoutDiscountRow && checkoutDiscountValue) {
        checkoutDiscountRow.style.display = "flex";
        checkoutDiscountValue.textContent = `- ${formatPrice(discount)}`;
      }
    } else {
      if (checkoutDiscountRow) checkoutDiscountRow.style.display = "none";
    }

    const finalTotal = subtotal - discount;
    checkoutTotalValue.textContent = formatPrice(finalTotal);
    
    // Fill credit card installments dynamically
    updateInstallments(finalTotal);

    // Open modal & close cart sidebar
    cartSidebar.classList.remove("open");
    checkoutModal.classList.add("open");
  });

  checkoutModalClose.addEventListener("click", () => {
    checkoutModal.classList.remove("open");
    resetCheckoutView();
  });

  // Dynamic installments calculation
  function updateInstallments(totalValue) {
    const installmentsSelect = document.getElementById("card-installments");
    if (!installmentsSelect) return;
    installmentsSelect.innerHTML = "";
    
    for (let i = 1; i <= 6; i++) {
      const val = totalValue / i;
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${i}x de ${formatPrice(val)} sem juros`;
      installmentsSelect.appendChild(option);
    }
  }

  // Switch payment tabs
  paymentTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      paymentTabs.forEach(t => t.classList.remove("active"));
      paymentPanels.forEach(p => p.classList.remove("active"));
      
      tab.classList.add("active");
      const targetPanel = document.getElementById(`panel-${tab.getAttribute("data-tab")}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // --- VIA CEP AUTOCOMPLETE INTEGRATION ---
  const cepInput = document.getElementById("cust-cep");
  if (cepInput) {
    cepInput.addEventListener("input", (e) => {
      let cep = e.target.value.replace(/\D/g, "");
      // Format 00000-000
      if (cep.length > 5) {
        cep = cep.substring(0, 5) + "-" + cep.substring(5, 8);
      }
      e.target.value = cep;

      const cleanCep = cep.replace("-", "");
      if (cleanCep.length === 8) {
        // Feedback loader
        let loadingIndicator = document.getElementById("cep-loader-msg");
        if (!loadingIndicator) {
          loadingIndicator = document.createElement("span");
          loadingIndicator.id = "cep-loader-msg";
          loadingIndicator.style.fontSize = "11px";
          loadingIndicator.style.color = "var(--primary)";
          loadingIndicator.style.marginLeft = "10px";
          loadingIndicator.textContent = "Buscando CEP...";
          cepInput.parentNode.appendChild(loadingIndicator);
        }

        fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
          .then(res => res.json())
          .then(data => {
            document.getElementById("cep-loader-msg")?.remove();
            if (data.erro) {
              alert("CEP não encontrado. Preencha os dados manualmente.");
              return;
            }
            // Populate fields
            document.getElementById("cust-address").value = data.logradouro || "";
            document.getElementById("cust-bairro").value = data.bairro || "";
            document.getElementById("cust-city").value = data.localidade || "";
            document.getElementById("cust-state").value = data.uf || "";
            
            // Focus on number/complement input
            document.getElementById("cust-number").focus();
          })
          .catch(() => {
            document.getElementById("cep-loader-msg")?.remove();
            alert("Erro ao buscar CEP. Preencha os dados do endereço manualmente.");
          });
      }
    });
  }

  // --- MOCK PIX LOGIC ---
  const copyPixBtn = document.getElementById("copy-pix-key");
  const toastNotification = document.getElementById("toast-notification");

  copyPixBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(MOCK_PIX_KEY).then(() => {
      showToast("Chave PIX copiada com sucesso!");
    }).catch(() => {
      showToast("Falha ao copiar a chave. Tente novamente.");
    });
  });

  function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add("show");
    setTimeout(() => {
      toastNotification.classList.remove("show");
    }, 3000);
  }

  const confirmPixPayment = document.getElementById("confirm-pix-payment");
  confirmPixPayment.addEventListener("click", () => {
    if (!validateCheckoutForm()) return;
    finishOrder("PIX");
  });

  // --- INTERACTIVE 3D CREDIT CARD FORM ---
  const cardNumInput = document.getElementById("card-number");
  const cardNameInput = document.getElementById("card-name");
  const cardExpInput = document.getElementById("card-expiry");
  const cardCvvInput = document.getElementById("card-cvv");
  
  const cardView = document.getElementById("credit-card-view");
  const previewNum = document.getElementById("card-num-preview");
  const previewName = document.getElementById("card-name-preview");
  const previewExp = document.getElementById("card-exp-preview");
  const previewCvv = document.getElementById("card-cvv-preview");

  // Format Card Number (space every 4 digits)
  cardNumInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value[i];
    }
    e.target.value = formatted;
    previewNum.textContent = formatted || "•••• •••• •••• ••••";
  });

  // Card Holder Name sync
  cardNameInput.addEventListener("input", (e) => {
    previewName.textContent = e.target.value.toUpperCase() || "NOME DO TITULAR";
  });

  // Expiry Date (MM/AA formatting)
  cardExpInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
    previewExp.textContent = value || "MM/AA";
  });

  // CVV focus flips the card
  cardCvvInput.addEventListener("focus", () => {
    cardView.classList.add("flipped");
  });
  cardCvvInput.addEventListener("blur", () => {
    cardView.classList.remove("flipped");
  });
  cardCvvInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
    previewCvv.textContent = value || "•••";
  });

  const confirmCardPayment = document.getElementById("confirm-card-payment");
  confirmCardPayment.addEventListener("click", () => {
    if (!validateCheckoutForm()) return;
    
    // Validate card inputs specifically
    if (cardNumInput.value.length < 16) {
      alert("Por favor, preencha um número de cartão de crédito válido.");
      cardNumInput.focus();
      return;
    }
    if (!cardNameInput.value.trim()) {
      alert("Por favor, digite o nome impresso no cartão.");
      cardNameInput.focus();
      return;
    }
    if (cardExpInput.value.length < 5) {
      alert("Por favor, preencha a data de validade (MM/AA).");
      cardExpInput.focus();
      return;
    }
    if (cardCvvInput.value.length < 3) {
      alert("Por favor, preencha o código CVV corretamente.");
      cardCvvInput.focus();
      return;
    }

    const installments = document.getElementById("card-installments").value;
    finishOrder(`Cartão de Crédito (Parcelado em ${installments}x)`);
  });

  // --- WHATSAPP ORDER GENERATION ---
  const sendWhatsappOrder = document.getElementById("send-whatsapp-order");
  sendWhatsappOrder.addEventListener("click", () => {
    if (!validateCheckoutForm()) return;
    
    // Generate order number and validation code
    const orderNumber = "AL" + Math.floor(100000 + Math.random() * 900000);
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const datePart = Date.now().toString(36).substring(4).toUpperCase();
    const validationCode = `SEC-${randPart}-${datePart}`;

    const clientName = document.getElementById("cust-name").value.trim();
    const clientPhone = document.getElementById("cust-phone").value.trim();
    const clientCep = document.getElementById("cust-cep").value.trim();
    const clientAddress = document.getElementById("cust-address").value.trim();
    const clientNumber = document.getElementById("cust-number").value.trim();
    const clientBairro = document.getElementById("cust-bairro").value.trim();
    const clientCity = document.getElementById("cust-city").value.trim();
    const clientState = document.getElementById("cust-state").value.trim();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = activeCoupon ? subtotal * activeCoupon.rate : 0;
    const finalTotal = subtotal - discount;
    
    let message = `Olá, Studio Anna Leite! Gostaria de finalizar o meu pedido:\n\n`;
    message += `*Pedido:* #${orderNumber}\n`;
    message += `*Código de Segurança:* ${validationCode}\n\n`;
    message += `*Cliente:* ${clientName}\n`;
    message += `*WhatsApp:* ${clientPhone}\n`;
    message += `*CEP:* ${clientCep}\n`;
    message += `*Endereço:* ${clientAddress}, Nº ${clientNumber} - ${clientBairro}, ${clientCity}/${clientState}\n\n`;
    
    message += `*Itens do Pedido:*\n`;
    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.quantity}x) - Tam: ${item.size} - Cor: ${item.color} | R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    if (activeCoupon) {
      message += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;
      message += `*Desconto (Cupom ${activeCoupon.code}):* - ${formatPrice(discount)}\n`;
    }
    
    message += `\n*Total:* ${formatPrice(finalTotal)}\n`;
    message += `*Frete:* Grátis (Sedex)\n`;
    message += `*Método de Pagamento:* A combinar pelo WhatsApp`;

    const encoded = encodeURIComponent(message);
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    
    window.open(link, "_blank");
    
    finishOrder("WhatsApp (Envio Pendente)", orderNumber, validationCode);
  });

  // Form Validation helper
  function validateCheckoutForm() {
    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const cep = document.getElementById("cust-cep").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const number = document.getElementById("cust-number").value.trim();
    const bairro = document.getElementById("cust-bairro").value.trim();
    const city = document.getElementById("cust-city").value.trim();
    const state = document.getElementById("cust-state").value.trim();

    if (!name || !phone || !cep || !address || !number || !bairro || !city || !state) {
      alert("Por favor, preencha todos os dados pessoais e de entrega.");
      document.getElementById("cust-name").focus();
      return false;
    }
    return true;
  }

  // Finish order helper
  function finishOrder(paymentMethod, existingOrderNumber, existingValidationCode) {
    const clientName = document.getElementById("cust-name").value.trim();
    
    // Generate order number and validation code if not provided
    const orderNumber = existingOrderNumber || ("AL" + Math.floor(100000 + Math.random() * 900000));
    
    let validationCode = existingValidationCode;
    if (!validationCode) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const datePart = Date.now().toString(36).substring(4).toUpperCase();
      validationCode = `SEC-${randPart}-${datePart}`;
    }
    
    // Calculate final total to display on success screen
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = activeCoupon ? subtotal * activeCoupon.rate : 0;
    const finalTotal = subtotal - discount;

    // Populate Success Screen fields
    const successClientName = document.getElementById("success-client-name");
    const successOrderNumber = document.getElementById("success-order-number");
    const successValidationCode = document.getElementById("success-validation-code");
    const successPaymentMethod = document.getElementById("success-payment-method");
    const successTotalValue = document.getElementById("success-total-value");

    if (successClientName) successClientName.textContent = clientName;
    if (successOrderNumber) successOrderNumber.textContent = `#${orderNumber}`;
    if (successValidationCode) successValidationCode.textContent = validationCode;
    if (successPaymentMethod) successPaymentMethod.textContent = paymentMethod;
    if (successTotalValue) successTotalValue.textContent = formatPrice(finalTotal);

    // Toggle checkout modal view to success panel
    const checkoutGrid = document.querySelector(".checkout-grid");
    const checkoutSuccess = document.getElementById("checkout-success");
    if (checkoutGrid && checkoutSuccess) {
      checkoutGrid.style.display = "none";
      checkoutSuccess.style.display = "block";
    }
    
    // Clear everything
    cart = [];
    activeCoupon = null;
    if (couponInput) couponInput.value = "";
    if (couponFeedback) couponFeedback.textContent = "";
    updateCart();
    
    // Reset forms
    document.getElementById("checkout-form").reset();
    if (document.getElementById("card-inputs-form")) {
      document.getElementById("card-inputs-form").reset();
      previewNum.textContent = "•••• •••• •••• ••••";
      previewName.textContent = "NOME DO TITULAR";
      previewExp.textContent = "MM/AA";
      previewCvv.textContent = "•••";
    }
  }

  // Connect close button on success screen
  const successCloseBtn = document.getElementById("success-close-btn");
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
      checkoutModal.classList.remove("open");
      resetCheckoutView();
    });
  }

  // Helper to reset checkout modal view
  function resetCheckoutView() {
    const checkoutGrid = document.querySelector(".checkout-grid");
    const checkoutSuccess = document.getElementById("checkout-success");
    if (checkoutGrid && checkoutSuccess) {
      checkoutGrid.style.display = "grid";
      checkoutSuccess.style.display = "none";
    }
  }

  // --- CLOSE MODALS ON OVERLAY CLICK ---
  window.addEventListener("click", (e) => {
    if (e.target === productModal) {
      productModal.classList.remove("open");
    }
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("open");
      resetCheckoutView();
    }
    if (e.target === sizeGuideModal) {
      sizeGuideModal.classList.remove("open");
    }
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll(".reveal-element").forEach(el => {
    revealObserver.observe(el);
  });

  // --- SEARCH DRAWER CONTROLS ---
  if (searchToggle && searchDrawer && searchInput) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita propagar para o document click listener
      searchDrawer.classList.toggle("open");
      if (searchDrawer.classList.contains("open")) {
        searchInput.focus();
      } else {
        searchInput.value = "";
        const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
        renderCatalog(activeFilter);
      }
    });

    // Impede que cliques dentro da caixa de busca fechem a mesma
    searchDrawer.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value;
      if (query.trim() !== "") {
        // Se há busca digitada, redefine o filtro de categoria para "Tudo" visualmente
        filterButtons.forEach(b => b.classList.remove("active"));
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add("active");
        
        renderCatalog("all", query);
      } else {
        // Se limpar o texto, mostra todos
        renderCatalog("all");
      }
    });

    if (searchClear) {
      searchClear.addEventListener("click", (e) => {
        e.stopPropagation();
        searchInput.value = "";
        renderCatalog("all");
        searchInput.focus();
      });
    }

    // Fechar a busca ao clicar fora dela
    document.addEventListener("click", (e) => {
      if (searchDrawer.classList.contains("open")) {
        // Se o clique foi fora do drawer e do botão toggle
        if (!searchDrawer.contains(e.target) && !searchToggle.contains(e.target)) {
          searchDrawer.classList.remove("open");
          searchInput.value = "";
          const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
          renderCatalog(activeFilter);
        }
      }
    });

    // Fechar a busca ao rolar a página significativamente (melhoria mobile/desktop)
    window.addEventListener("scroll", () => {
      if (searchDrawer.classList.contains("open") && window.scrollY > 150) {
        searchDrawer.classList.remove("open");
        searchInput.value = "";
        const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
        renderCatalog(activeFilter);
      }
    }, { passive: true });

    // Close search on Esc key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchDrawer.classList.contains("open")) {
        searchDrawer.classList.remove("open");
        searchInput.value = "";
        const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
        renderCatalog(activeFilter);
      }
    });
  }

  // --- INITIAL RENDERING ---
  renderCatalog();
  renderCart();
});
