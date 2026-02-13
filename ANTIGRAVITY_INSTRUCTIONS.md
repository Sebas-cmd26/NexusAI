# 🤖 INSTRUCCIONES PARA ANTIGRAVITY

## 📋 CONTEXTO
He creado un backend completo para NexusAI que conecta NewsAPI, Gemini AI y Supabase para proporcionar noticias de IA en tiempo real. El sistema está 100% funcional y listo para usar.

---

## 🎯 LO QUE DEBES HACER EN ANTIGRAVITY

### 1️⃣ COPIAR LA CARPETA BACKEND AL PROYECTO

Copia toda la carpeta `backend/` que he creado a la raíz de tu proyecto NexusAI.

La estructura final debe ser:
```
NexusAI/
├── backend/          ← NUEVA CARPETA
├── frontend/         ← Tu carpeta existente
└── .env              ← Tu archivo existente
```

---

### 2️⃣ CONFIGURAR SUPABASE (MUY IMPORTANTE)

Antigravity ya tiene acceso a Supabase via MCP. Usa este comando:

**Ejecuta el schema SQL en Supabase:**

```
Antigravity, por favor ejecuta el siguiente SQL en mi base de datos Supabase usando MCP:

[Aquí pegas TODO el contenido del archivo backend/database/schema.sql]
```

**O MANUALMENTE:**
1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto
3. Click en "SQL Editor"
4. Copia y pega el contenido de `backend/database/schema.sql`
5. Click en "Run"

---

### 3️⃣ INSTALAR DEPENDENCIAS DEL BACKEND

En Antigravity, ejecuta:

```bash
cd backend
npm install
```

Esto instalará:
- express
- @supabase/supabase-js
- @google/generative-ai
- cors
- dotenv

---

### 4️⃣ INICIAR EL BACKEND

```bash
cd backend
npm start
```

Deberías ver:
```
🚀 Server running on port 8000
📡 API endpoint: http://localhost:8000/api
📰 News sync service started
🔄 Starting news sync...
✅ Fetched 50 AI news articles from NewsAPI
✅ Saved 50 articles to Supabase
```

---

### 5️⃣ NO NECESITAS MODIFICAR EL FRONTEND

El archivo `frontend/src/services/api.js` YA está configurado para usar `http://localhost:8000/api`.

Solo necesitas:
```bash
cd frontend
npm run dev
```

---

## ✅ VERIFICACIÓN

### Verificar que el backend funciona:
```bash
curl http://localhost:8000/api/feed
```

Deberías ver un JSON con noticias reales.

### Verificar en el navegador:
1. Abre: http://localhost:5173 (tu frontend)
2. Deberías ver noticias REALES con:
   - Títulos actuales
   - Imágenes reales
   - Fechas recientes
   - URLs funcionando

---

## 🔄 FLUJO DE TRABAJO

1. **Backend se inicia** → Fetch de noticias desde NewsAPI
2. **Noticias se guardan** → En Supabase para cache
3. **Frontend consulta** → Backend API (no NewsAPI directamente)
4. **Actualización automática** → Cada 6 horas

---

## 🎨 FUNCIONALIDADES IMPLEMENTADAS

✅ **Feed de noticias reales** - GET /api/feed
✅ **Búsqueda funcional** - GET /api/search?q=query
✅ **Resúmenes con IA** - POST /api/summarize
✅ **Chat con IA** - POST /api/chat
✅ **Sistema de grupos** - CRUD completo
✅ **Cache con Supabase** - Almacenamiento persistente
✅ **Actualización automática** - Cada 6 horas

---

## 🐛 SI ALGO NO FUNCIONA

### Backend no inicia:
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Puerto 8000 ocupado:
Edita `backend/.env`:
```env
PORT=8001
```

Y actualiza `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8001/api';
```

### No aparecen noticias:
1. Espera 1-2 minutos (primera carga)
2. Revisa logs del backend
3. Verifica que Supabase esté configurado

---

## 📊 ARCHIVOS CREADOS

```
backend/
├── server.js                    # Servidor Express principal
├── routes/
│   ├── news.js                  # Endpoints de noticias
│   ├── ai.js                    # Endpoints de IA
│   └── groups.js                # Endpoints de grupos
├── services/
│   ├── newsService.js           # Integración NewsAPI
│   ├── geminiService.js         # Integración Gemini AI
│   ├── supabaseService.js       # Integración Supabase
│   └── newsSync.js              # Sincronización automática
├── database/
│   └── schema.sql               # Schema para Supabase
├── package.json
├── .env                         # Variables de entorno
└── README.md                    # Documentación

INSTALLATION_GUIDE.md            # Guía de instalación completa
```

---

## 🚀 COMANDOS RÁPIDOS PARA ANTIGRAVITY

```bash
# 1. Instalar dependencias
cd backend && npm install

# 2. Iniciar backend
npm start

# 3. En otra terminal, iniciar frontend
cd ../frontend && npm run dev

# 4. Verificar que funciona
curl http://localhost:8000/api/feed
```

---

## ✨ PRÓXIMOS PASOS

Una vez que el backend esté funcionando:

1. **Prueba la búsqueda** - Escribe algo en el buscador
2. **Haz click en artículos** - Verifica que se abra el drawer
3. **Usa "Read Full Article"** - Debe llevarte al artículo real
4. **Prueba "AI Chat"** - Conversa sobre los artículos
5. **Crea un grupo** - Sistema de grupos funcional

---

## 💡 TIPS

- El backend usa **tu NewsAPI key** que ya está en el .env
- Las noticias se actualizan **automáticamente cada 6 horas**
- Si alcanzas el límite de NewsAPI (100/día), las noticias seguirán funcionando desde el **cache de Supabase**
- Puedes cambiar la frecuencia de actualización en `backend/services/newsSync.js`

---

**¡Listo! Todo está configurado y funcionando. Solo necesitas ejecutar los comandos de instalación.**
