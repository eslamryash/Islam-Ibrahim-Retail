(() => {
  const config = window.STORE_CONFIG;
  const products = window.PRODUCTS || [];
  const cart = {};
  let category = "All";
  const $ = (id) => document.getElementById(id);
  const money = (n) => new Intl.NumberFormat(undefined,{style:"currency",currency:config.currency}).format(n);
  const toast = (msg) => { $("toast").textContent=msg; $("toast").classList.add("show"); setTimeout(()=>$("toast").classList.remove("show"),2300); };
  const grid = $("product-grid");

  function renderProducts(){
    grid.innerHTML = "";
    products.filter(p=>category==="All"||p.category===category).forEach(p=>{
      const card=document.createElement("article"); card.className="product-card";
      card.innerHTML=`<div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag||p.category.toUpperCase()}</span><button class="add-button" data-add="${p.id}">ADD TO BAG +</button></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.description}</p></div><span class="price">${money(p.price)}</span></div>`;
      grid.appendChild(card);
    });
  }
  function totals(){let count=0,total=0;Object.entries(cart).forEach(([id,q])=>{const p=products.find(x=>x.id===id);if(p){count+=q;total+=p.price*q;}});return {count,total};}
  function renderCart(){
    const items=$("cart-items"); items.innerHTML="";
    Object.entries(cart).forEach(([id,q])=>{
      const p=products.find(x=>x.id===id); if(!p)return;
      const row=document.createElement("div");row.className="cart-row";
      row.innerHTML=`<img src="${p.image}" alt=""><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty-controls"><button data-dec="${id}" aria-label="Decrease quantity">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase quantity">+</button></div></div><button class="remove" data-remove="${id}">REMOVE</button>`;
      items.appendChild(row);
    });
    if(!Object.keys(cart).length)items.innerHTML='<p class="empty-cart">Your bag is waiting for something special.</p>';
    const t=totals();$("cart-count").textContent=t.count;$("subtotal").textContent=money(t.total);
  }
  function openCart(){ $("cart-drawer").classList.add("open");$("cart-backdrop").classList.add("open");$("cart-drawer").setAttribute("aria-hidden","false"); }
  function closeCart(){ $("cart-drawer").classList.remove("open");$("cart-backdrop").classList.remove("open");$("cart-drawer").setAttribute("aria-hidden","true"); }
  function orderText(){const lines=Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id===id);return p?`${q} x ${p.name} — ${money(p.price*q)}`:"";}).filter(Boolean);return `Hello, I would like to place an order from ${config.storeName}:\n\n${lines.join("\n")}\n\nSubtotal: ${money(totals().total)}\nPlease confirm availability, shipping and final total.`;}
  function whatsappReady(){return config.whatsappNumber && !config.whatsappNumber.includes("REPLACE");}
  document.addEventListener("click",e=>{
    const add=e.target.closest("[data-add]");if(add){cart[add.dataset.add]=(cart[add.dataset.add]||0)+1;renderCart();toast("Added to your bag");}
    const inc=e.target.closest("[data-inc]");if(inc){cart[inc.dataset.inc]++;renderCart();}
    const dec=e.target.closest("[data-dec]");if(dec){cart[dec.dataset.dec]--;if(cart[dec.dataset.dec]<=0)delete cart[dec.dataset.dec];renderCart();}
    const rem=e.target.closest("[data-remove]");if(rem){delete cart[rem.dataset.remove];renderCart();}
    const filter=e.target.closest("[data-category]");if(filter){category=filter.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();}
  });
  $("open-cart").addEventListener("click",openCart);$("close-cart").addEventListener("click",closeCart);$("cart-backdrop").addEventListener("click",closeCart);
  $("whatsapp-checkout").addEventListener("click",()=>{
    if(!Object.keys(cart).length){toast("Your bag is empty");return;}
    if(!whatsappReady()){ $("checkout-note").textContent="Set your WhatsApp number in config.js before accepting orders.";return;}
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(orderText())}`,"_blank","noopener");
  });
  $("stripe-checkout").addEventListener("click",async()=>{
    if(!Object.keys(cart).length){toast("Your bag is empty");return;}
    $("checkout-note").textContent="Connecting securely to Stripe…";
    try{
      const response=await fetch(config.stripeCheckoutEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:Object.entries(cart).map(([id,quantity])=>({id,quantity}))})});
      const data=await response.json();
      if(!response.ok||!data.url)throw new Error(data.error||"Stripe checkout is not configured yet.");
      window.location.href=data.url;
    }catch(err){$("checkout-note").textContent=err.message+" Follow the Stripe setup in README.md."; }
  });
  $("footer-whatsapp").addEventListener("click",e=>{if(!whatsappReady()){e.preventDefault();toast("Add your WhatsApp number in config.js first");}else e.currentTarget.href=`https://wa.me/${config.whatsappNumber}`;});
  $("year").textContent=new Date().getFullYear();
  renderProducts();renderCart();
})();