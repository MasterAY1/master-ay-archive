import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Menu, ArrowRight, Star, Plus, X, Minus, Trash2, Heart, Search, Eye, ChevronDown, Loader2 } from 'lucide-react';

const CATEGORIES = ["All", "Furniture", "Decor", "Lighting"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Highest Rated"];

export default function LuminaStore() {
  // --- APPLICATION STATE ---
  const [products, setProducts] = useState([]); // Moved from hardcoded to dynamic state!
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Checkout loading state

  // --- ENGINE: FETCH INVENTORY FROM PYTHON BACKEND ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // We will build this Python route next!
        const res = await fetch('https://vault-api-master-ay.onrender.com/api/store/inventory');
        const data = await res.json();
        
        if (data.status === 'success') {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load inventory:", err);
        showToast("⚠️ Could not connect to database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // --- ACTIONS ---
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`Added ${product.name} to cart!`);
    if (quickViewProduct) setQuickViewProduct(null); 
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  // --- ENGINE: STRIPE CHECKOUT PIPELINE ---
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Send the cart data to Python, which will talk to Stripe
      const response = await fetch('https://vault-api-master-ay.onrender.com/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.checkout_url) {
        // Redirect the user to the secure Stripe payment page
        window.location.href = data.checkout_url;
      } else {
        showToast("⚠️ Checkout failed to initialize.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      showToast("⚠️ Network error during checkout.");
      setIsCheckingOut(false);
    }
  };

  // --- DERIVED STATE ---
  const cartTotalQty = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim() !== "") result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (sortBy) {
      case "Price: Low to High": result.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": result.sort((a, b) => b.price - a.price); break;
      case "Highest Rated": result.sort((a, b) => b.rating - a.rating); break;
      default: break; 
    }
    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const scrollToShop = () => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-900 selection:text-white pb-20 relative overflow-x-hidden">
      
      {/* --- NOTIFICATION TOAST --- */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        {toast}
      </div>

      {/* --- QUICK VIEW MODAL --- */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm transition-colors shadow-sm"><X size={20} /></button>
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-100">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{quickViewProduct.category}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900"><Star size={12} className="fill-gray-900" /> {quickViewProduct.rating}</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{quickViewProduct.name}</h2>
              <p className="text-2xl font-light text-gray-500 mb-6">${quickViewProduct.price}</p>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">{quickViewProduct.description}</p>
              <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                <button onClick={() => addToCart(quickViewProduct)} className="flex-1 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors flex justify-center items-center gap-2"><ShoppingCart size={18} /> Add to Cart</button>
                <button onClick={(e) => toggleFavorite(quickViewProduct.id, e)} className={`p-4 rounded-full border border-gray-200 transition-colors flex items-center justify-center ${favorites.includes(quickViewProduct.id) ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-gray-50 text-gray-400'}`}><Heart size={20} className={favorites.includes(quickViewProduct.id) ? "fill-red-500" : ""} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight">Your Cart ({cartTotalQty})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingCart size={48} strokeWidth={1} />
              <p>Your cart is empty.</p>
              <button onClick={() => { setIsCartOpen(false); scrollToShop(); }} className="mt-4 px-6 py-2 bg-gray-100 text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-colors">Start Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl bg-gray-100" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-sm text-gray-500">${item.price}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-full">
                      <button onClick={() => updateCartQty(item.id, -1)} className="p-1.5 hover:bg-gray-100 rounded-l-full transition-colors"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, 1)} className="p-1.5 hover:bg-gray-100 rounded-r-full transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-2xl font-bold">${cartTotalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Secure Checkout</>}
            </button>
          </div>
        )}
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-40 bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            LUMINA<span className="text-gray-400">.</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); scrollToShop(); }} className={`transition-colors ${activeCategory === cat ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'hover:text-gray-900'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 ring-gray-200 transition-shadow">
              <Search size={16} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); scrollToShop(); }} className="bg-transparent text-sm focus:outline-none w-32 lg:w-48" />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-gray-600 transition-colors group">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cartTotalQty > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">{cartTotalQty}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide uppercase text-gray-600">Spring Collection 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">Curated pieces for <br className="hidden md:block" /><span className="italic font-light text-gray-500">mindful living.</span></h1>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed">Elevate your space with our sustainably sourced, handcrafted furniture. Designed to bring balance and warmth to your everyday environment.</p>
          <button onClick={scrollToShop} className="group w-fit flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-colors mt-2 shadow-lg shadow-gray-900/20">Shop the Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
        </div>
        <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop" alt="Living Room" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0 duration-700"></div>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section id="shop-section" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">The Catalog</h2>
            <p className="text-gray-500 text-sm">Showing {processedProducts.length} items</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="sm:hidden flex items-center bg-gray-100 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm focus:outline-none w-full" />
            </div>
            <div className="relative inline-block w-full sm:w-48">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none bg-gray-100 border border-transparent hover:border-gray-200 text-sm font-medium rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 ring-gray-900 transition-all cursor-pointer">
                {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- LOADING SKELETON --- */}
        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-32 text-gray-400">
             <Loader2 size={40} className="animate-spin mb-4 text-gray-900" />
             <p className="text-sm font-medium tracking-wide uppercase">Connecting to Database...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {processedProducts.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button onClick={(e) => toggleFavorite(product.id, e)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-900 hover:bg-white transition-all shadow-sm translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300">
                      <Heart size={16} className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-md text-gray-900 font-medium px-6 py-3 rounded-full shadow-xl flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white w-[85%]">
                    <Plus size={16} /> Quick Add
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-1 mt-auto">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 cursor-pointer hover:underline decoration-gray-300 underline-offset-4" onClick={() => setQuickViewProduct(product)}>{product.name}</p>
                    <p className="font-bold tracking-tight">${product.price}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                    <p>{product.category}</p>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Star size={10} className="fill-gray-900 text-gray-900" />
                      <span className="font-medium text-xs">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {processedProducts.length === 0 && !isLoading && (
              <div className="col-span-full py-24 text-center">
                <Search size={32} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}