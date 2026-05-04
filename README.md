# 🎴 PokéCards Market

Aplicación web interactiva donde los usuarios pueden explorar, visualizar y comprar cartas coleccionables inspiradas en personajes obtenidos desde la PokéAPI.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL%20Neon.tech-4169E1?style=flat-square&logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Pagos-PayPal%20Sandbox-003087?style=flat-square&logo=paypal)

---

## 📋 Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)
- Una cuenta en [Neon.tech](https://neon.tech) (base de datos PostgreSQL gratuita)
- Una cuenta en [PayPal Developer](https://developer.paypal.com) (para las credenciales Sandbox)

---

## 🚀 Instrucciones de instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/pokecards-market.git
cd pokecards-market
```

### 2. Configurar la Base de Datos (Neon.tech)

1. Crea una cuenta gratuita en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto llamado `pokecards-market`
3. Ve al **SQL Editor** y ejecuta el siguiente script:

```sql
CREATE TABLE IF NOT EXISTS purchases (
  id               SERIAL PRIMARY KEY,
  session_id       VARCHAR(255) NOT NULL,
  pokemon_id       INTEGER      NOT NULL,
  pokemon_name     VARCHAR(100) NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  paypal_order_id  VARCHAR(255) UNIQUE NOT NULL,
  paypal_status    VARCHAR(50)  NOT NULL,
  purchased_at     TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_session
ON purchases(session_id);
```

4. Copia el **Connection String** desde el dashboard de Neon.tech. Tiene este formato:
postgresql://usuario:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require

---

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` dentro de la carpeta `backend/`:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
PAYPAL_CLIENT_ID=TU_PAYPAL_CLIENT_ID_SANDBOX
PAYPAL_CLIENT_SECRET=TU_PAYPAL_CLIENT_SECRET_SANDBOX
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Reemplaza `DATABASE_URL`, `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` con tus propias credenciales.

Inicia el backend:

```bash
npm run dev
```

Verifica que esté corriendo abriendo en el navegador:
http://localhost:3001/api/health
Debes ver: `{ "status": "OK" }`

---

### 4. Configurar el Frontend

Abre una **nueva terminal** y ejecuta:

```bash
cd frontend
npm install
```

Crea el archivo `.env` dentro de la carpeta `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_PAYPAL_CLIENT_ID=TU_PAYPAL_CLIENT_ID_SANDBOX
```

> ⚠️ El `VITE_PAYPAL_CLIENT_ID` debe ser el mismo Client ID que usaste en el backend.

Inicia el frontend:

```bash
npm run dev
```

Abre en el navegador:
http://localhost:5173

---

## 💳 Credenciales de prueba — PayPal Sandbox

Para probar el flujo de compra usa estas credenciales en la ventana de PayPal:

| Campo | Valor |
|-------|-------|
| **Email** | `sb-vluwl50925693@personal.example.com` |
| **Contraseña** | `vn-5G3LA` |
| **Tipo de cuenta** | Personal (comprador) |

> ℹ️ Estas son credenciales de la cuenta Sandbox. Ningún cobro real se realiza.

---

## 🗂️ Estructura del proyecto
pokecards-market/
├── backend/                  # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # Conexión a PostgreSQL
│   │   ├── controllers/
│   │   │   ├── paypalController.js
│   │   │   └── purchaseController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── paypal.js
│   │   │   └── purchases.js
│   │   └── app.js
│   ├── .env                  # ⚠️ No incluido en el repo
│   ├── package.json
│   └── server.js
│
└── frontend/                 # Vite + React
├── public/
│   └── _redirects
├── src/
│   ├── api/
│   │   ├── backend.js
│   │   └── pokeapi.js
│   ├── components/
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── PokemonCard.jsx
│   │   └── PurchaseModal.jsx
│   ├── context/
│   │   └── PurchaseContext.jsx
│   ├── pages/
│   │   ├── Collection.jsx
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                  # ⚠️ No incluido en el repo
├── package.json
└── vite.config.js

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| React + Vite | Interfaz de usuario |
| React Router DOM | Navegación entre páginas |
| Axios | Peticiones HTTP |
| Node.js + Express | Servidor backend |
| PostgreSQL (Neon.tech) | Base de datos |
| PayPal SDK | Procesamiento de pagos |
| PokéAPI | Datos de los pokémon |

---

## 📡 Endpoints del Backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Verifica que el servidor está activo |
| `POST` | `/api/paypal/create-order` | Crea una orden de pago en PayPal |
| `POST` | `/api/paypal/capture-order` | Confirma el pago y guarda la compra |
| `GET` | `/api/purchases/:sessionId` | Obtiene las cartas compradas del usuario |

---

## ▶️ Comandos de ejecución rápida

Una vez configurados los archivos `.env`, para correr el proyecto necesitas **dos terminales**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## 👨‍💻 Autor Mauricio Bustillo

Desarrollado como proyecto del Parcial II.