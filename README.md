# Barber Shop App - Axial Flare

Este proyecto consta de un **Backend** (Node.js/Express) y un **Frontend** (Next.js).

## 🚀 Cómo empezar en Visual Studio Code

### 1. Requisitos Previos
- Node.js instalado (v18 o superior).
- Una cuenta en [Supabase](https://supabase.com/).
- Una API Key gratuita de [WeatherAPI](https://www.weatherapi.com/).

### 2. Configuración del Backend
1. Abre una terminal en VS Code.
2. Ve a la carpeta del backend: `cd backend`
3. Instala las dependencias: `npm install`
4. Configura las variables de entorno:
   - Copia `.env.example` a `.env`
   - Rellena `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET` y `WEATHER_API_KEY`.
5. Inicia el servidor: `npm run dev` (se ejecutará en http://localhost:4000)

### 3. Configuración del Frontend
1. Abre otra terminal en VS Code.
2. Ve a la carpeta del frontend: `cd frontend`
3. Instala las dependencias: `npm install`
4. Configura las variables de entorno:
   - Crea un archivo `.env.local`
   - Añade: `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
5. Inicia la aplicación: `npm run dev` (se ejecutará en http://localhost:3000)

## 🛠️ Tecnologías utilizadas
- **Backend**: Express, JWT, Supabase SDK, Axios (Weather API), Jest.
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Axios.

## 🧪 Pruebas
Para correr los tests del backend:
```bash
cd backend
npm test
```

---
¡Disfruta de tu aplicación de Barbería! 💈
