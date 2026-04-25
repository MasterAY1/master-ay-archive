import sqlite3
import os
import json
import requests
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🏦 DATABASE INITIALIZATION
# ==========================================
def init_db():
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    
    # 1. Fintech Table
    cursor.execute("CREATE TABLE IF NOT EXISTS portfolio (id INTEGER PRIMARY KEY, buying_power REAL)")
    
    # 2. Nova AI Tables
    cursor.execute("CREATE TABLE IF NOT EXISTS nova_history (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, messages TEXT DEFAULT '[]', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    cursor.execute("CREATE TABLE IF NOT EXISTS nova_settings (id INTEGER PRIMARY KEY, global_memory TEXT)")
    
    # 3. ✨ NEW: E-Commerce Products Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS store_products_v2 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            price REAL,
            rating REAL,
            image TEXT,
            description TEXT
        )
    """)
    
    # Check if we need to seed the initial inventory
    cursor.execute("SELECT COUNT(*) FROM store_products_v2")
    if cursor.fetchone()[0] == 0:
        initial_products = [
            ("iPhone 15 Pro Max", "Electronics", 1850000, 4.9, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800", "Titanium design with A17 Pro chip and incredible camera system."),
            ("MacBook Pro M3", "Electronics", 2500000, 5.0, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800", "Mind-blowing performance in a sleek aluminum unibody."),
            ("Sony WH-1000XM5", "Electronics", 450000, 4.8, "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800", "Industry-leading noise cancellation and supreme comfort."),
            ("PlayStation 5 Console", "Electronics", 950000, 4.9, "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800", "Next-gen gaming experience with lightning-fast SSD."),
            ("Nike Air Force 1", "Fashion", 150000, 4.7, "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?q=80&w=800", "Classic streetwear staple with durable leather construction."),
            ("Zara Trench Coat", "Fashion", 85000, 4.6, "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800", "Elegant and timeless outerwear for any season."),
            ("Casio G-Shock", "Fashion", 65000, 4.8, "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800", "Rugged, water-resistant, and built for extreme conditions."),
            ("Velvet Luxury Sofa", "Home", 850000, 4.9, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", "Plush velvet seating with modern brass accents."),
            ("LG 65-Inch OLED TV", "Electronics", 1200000, 5.0, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800", "Stunning 4K display with perfect blacks and infinite contrast."),
            ("Adjustable Dumbbell Set", "Fitness", 120000, 4.7, "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", "Space-saving design that replaces 15 sets of weights."),
            ("Treadmill Pro Max", "Fitness", 650000, 4.8, "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800", "Commercial-grade treadmill with smart screen integration."),
            ("Minimalist Coffee Table", "Home", 150000, 4.6, "https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=800", "Sleek wooden coffee table to elevate your living room.")
        ]
        cursor.executemany("INSERT INTO store_products_v2 (name, category, price, rating, image, description) VALUES (?, ?, ?, ?, ?, ?)", initial_products)

    # Re-initialize other defaults
    cursor.execute("SELECT COUNT(*) FROM portfolio")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO portfolio (buying_power) VALUES (25000.00)")
    cursor.execute("SELECT COUNT(*) FROM nova_settings")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO nova_settings (global_memory) VALUES ('')")
        
    conn.commit()
    conn.close()

init_db()

# ==========================================
# 🛒 LUMINA STORE STATION (NEW!)
# ==========================================

@app.get("/api/store/inventory")
def get_inventory():
    conn = sqlite3.connect("vault.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM store_products_v2")
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "products": products}

class CartItem(BaseModel):
    id: int
    name: str
    price: float
    qty: int

class CheckoutRequest(BaseModel):
    items: List[CartItem]

@app.post("/api/store/checkout")
def create_checkout(req: CheckoutRequest):
    paystack_secret = os.environ.get("PAYSTACK_SECRET_KEY")
    if not paystack_secret:
        return {"status": "error", "message": "Backend configuration error: Missing API Key."}

    # 1. Calculate Total
    total = sum(item.price * item.qty for item in req.items)
    
    # Paystack requires the amount in the lowest denomination (Kobo for NGN)
    amount_in_kobo = int(total * 100)
    
    # 2. Build the Paystack API Request
    headers = {
        "Authorization": f"Bearer {paystack_secret}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "email": "architect@masteray.com", # Hardcoded for now, later we can add a user email input!
        "amount": amount_in_kobo,
        "currency": "NGN",
        # Send them back to your portfolio after paying
        "callback_url": "https://master-ay-archive.vercel.app/" 
    }
    
    try:
        # 3. Handshake with Paystack
        response = requests.post("https://api.paystack.co/transaction/initialize", json=payload, headers=headers)
        paystack_data = response.json()
        
        if paystack_data.get("status"):
            # Paystack gives us a secure URL. We send it back to React to redirect the user.
            auth_url = paystack_data["data"]["authorization_url"]
            return {"status": "success", "checkout_url": auth_url}
        else:
            return {"status": "error", "message": paystack_data.get("message")}
            
    except Exception as e:
        return {"status": "error", "message": "Failed to connect to payment gateway."}

# ... (Keep your Nova Chat logic at the bottom) ...

# ==========================================
# 🏦 VAULT FINTECH STATION (Unchanged)
# ==========================================
@app.get("/api/portfolio")
def get_portfolio():
    conn = sqlite3.connect("vault.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT buying_power FROM portfolio LIMIT 1")
    data = cursor.fetchone()
    conn.close()
    return dict(data)

class TradeRequest(BaseModel):
    amount: float
    action: str

@app.post("/api/trade")
def execute_trade(trade: TradeRequest):
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    cursor.execute("SELECT buying_power FROM portfolio LIMIT 1")
    current_bp = cursor.fetchone()[0]
    if trade.action == "Buy":
        if trade.amount > current_bp: return {"status": "error", "message": "Insufficient funds"}
        new_bp = current_bp - trade.amount
    else:
        new_bp = current_bp + trade.amount
    cursor.execute("UPDATE portfolio SET buying_power = ?", (new_bp,))
    conn.commit()
    conn.close()
    return {"status": "success", "new_buying_power": new_bp}

# ==========================================
# ✨ NOVA SETTINGS STATION (NEW!)
# ==========================================
class SettingsRequest(BaseModel):
    global_memory: str

@app.get("/api/nova/settings")
def get_settings():
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    cursor.execute("SELECT global_memory FROM nova_settings LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    return {"status": "success", "global_memory": row[0] if row else ""}

@app.post("/api/nova/settings")
def update_settings(req: SettingsRequest):
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE nova_settings SET global_memory = ?", (req.global_memory,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# ==========================================
# ✨ NOVA AI STATION
# ==========================================
@app.get("/api/nova/history")
def get_nova_history():
    conn = sqlite3.connect("vault.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, created_at FROM nova_history ORDER BY created_at DESC LIMIT 15")
    chats = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "history": chats}

@app.get("/api/nova/history/{chat_id}")
def get_single_chat(chat_id: int):
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    cursor.execute("SELECT messages FROM nova_history WHERE id = ?", (chat_id,))
    row = cursor.fetchone()
    conn.close()
    if row and row[0]: return {"status": "success", "messages": json.loads(row[0])}
    return {"status": "error", "messages": []}

class ProxyRequest(BaseModel):
    prompt: str
    schema_config: Optional[dict] = None

@app.post("/api/gemini/proxy")
def gemini_proxy(req: ProxyRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key: return {"error": "API Key is missing from backend configuration."}

    model = "gemini-2.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {"contents": [{"parts": [{"text": req.prompt}]}]}
    if req.schema_config:
        payload["generationConfig"] = {
            "responseMimeType": "application/json",
            "responseSchema": req.schema_config
        }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        return response.json()
    except Exception as e:
        return {"error": str(e)}

class ChatRequest(BaseModel):
    chat_id: Optional[int] = None
    prompt: str
    
@app.post("/api/nova/chat")
def nova_chat(req: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key: return {"error": "API Key is missing."}
    
    conn = sqlite3.connect("vault.db")
    cursor = conn.cursor()
    
    # FETCH CUSTOM INSTRUCTIONS FROM DATABASE
    cursor.execute("SELECT global_memory FROM nova_settings LIMIT 1")
    setting_row = cursor.fetchone()
    system_instruction = setting_row[0] if setting_row and setting_row[0] else "You are Nova, a helpful AI assistant."
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=system_instruction
    )
    
    db_messages = []
    if req.chat_id:
        cursor.execute("SELECT messages FROM nova_history WHERE id = ?", (req.chat_id,))
        row = cursor.fetchone()
        if row and row[0]: db_messages = json.loads(row[0])
    else:
        title = " ".join(req.prompt.split()[:4]) + "..."
        cursor.execute("INSERT INTO nova_history (title, messages) VALUES (?, ?)", (title, "[]"))
        req.chat_id = cursor.lastrowid

    gemini_history = [{"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]} for m in db_messages]

    try:
        chat_session = model.start_chat(history=gemini_history)
        response = chat_session.send_message(req.prompt)
        
        db_messages.append({"id": len(db_messages)+1, "role": "user", "content": req.prompt})
        db_messages.append({"id": len(db_messages)+2, "role": "ai", "content": response.text})
        
        cursor.execute("UPDATE nova_history SET messages = ? WHERE id = ?", (json.dumps(db_messages), req.chat_id))
        conn.commit()
        conn.close()
        
        return {"status": "success", "reply": response.text, "chat_id": req.chat_id}
    except Exception as e:
        conn.close()
        return {"status": "error", "reply": str(e)}