# DEFSUNETCG — Web de coleccionables TCG

Catálogo visual para Defsunetcg, vendedor particular de cartas TCG. Incluye escaparate público y panel de administración protegido.

**Stack:** React + Vite · Supabase (DB + Auth + Storage) · Tailwind CSS v4

---

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (plan gratuito suficiente)
- Cuenta en [Netlify](https://netlify.com) o [Vercel](https://vercel.com)

---

## 1. Configurar Supabase

### 1.1 Crear proyecto

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. Elige región cercana (p.ej. `eu-west-1 / Frankfurt`).
3. Guarda la contraseña de la base de datos.

### 1.2 Ejecutar el schema SQL

1. En el dashboard ve a **SQL Editor → New query**.
2. Pega el contenido de `supabase/schema.sql` y ejecuta.

Esto crea:
- Tabla `products` (singles, gradeadas PCG, gradeadas PSA/Beckett/CGC, packs)
- Tabla `events` (eventos y card shows)
- Políticas RLS: lectura pública, escritura solo autenticados
- Bucket de Storage `product-images` (público)

### 1.3 Crear usuario admin

1. Ve a **Authentication → Users → Invite user**.
2. Introduce el email de administrador (p.ej. `Defsunetcg@gmail.com`).
3. El usuario recibirá un email para establecer contraseña.

> **Importante:** No habilites el registro público. En **Authentication → Settings** deshabilita "Enable email confirmations" si quieres acceso inmediato en local.

### 1.4 Obtener las claves API

Ve a **Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

---

## 2. Configurar el proyecto local

```bash
# Clonar e instalar
git clone <repo>
cd DefsuneTCG
npm install

# Variables de entorno
cp .env.example .env
# Edita .env con tus valores de Supabase

# Desarrollo
npm run dev
```

La web estará en `http://localhost:5173`
El panel admin en `http://localhost:5173/admin`

---

## 3. Deploy en Netlify

```bash
npm run build
```

### Opción A — Netlify web (drag and drop)

Sube la carpeta `dist/` en [app.netlify.com/drop](https://app.netlify.com/drop).

### Opción B — GitHub + Netlify CI/CD (recomendado)

1. Conecta el repo en Netlify → **Add new site → Import from Git**.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. En **Site settings → Environment variables** añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Crea `public/_redirects` con el contenido `/* /index.html 200` para que el routing SPA funcione correctamente.

---

## 4. Deploy en Vercel (alternativa)

Conecta el repo en [vercel.com](https://vercel.com) y añade las variables de entorno.

Crea `vercel.json` en la raíz:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Navegación fija con scroll y menú móvil
│   ├── Hero.jsx            # Sección principal con logo y redes
│   ├── BuySection.jsx      # Info de compra/venta y contacto
│   ├── ProductGrid.jsx     # Grid de productos por categoría
│   ├── ProductCard.jsx     # Tarjeta individual de producto
│   ├── EventsSection.jsx   # Lista de eventos y card shows
│   ├── ContactSection.jsx  # Sección de contacto final
│   ├── SectionHeader.jsx   # Encabezado reutilizable
│   └── Footer.jsx
├── hooks/
│   └── useAuth.js          # Hook de autenticación Supabase
├── lib/
│   └── supabase.js         # Cliente Supabase
└── pages/
    ├── Home.jsx             # Página pública
    ├── Admin.jsx            # Guard: login o dashboard
    └── admin/
        ├── AdminLogin.jsx
        ├── AdminDashboard.jsx
        ├── ProductForm.jsx
        └── EventForm.jsx

supabase/
└── schema.sql              # Schema completo + RLS + Storage
```

---

## Panel de administración

URL: `/admin`

Funcionalidades:
- Login con email + contraseña (Supabase Auth)
- Gestión de productos por categoría: Singles, PCG, PSA/Beckett/CGC, Packs
  - Añadir, editar, eliminar
  - Subida de imagen directa a Supabase Storage
  - Badge de certificación (PSA / Beckett / CGC)
  - Descripción de contenido para packs
- Gestión de eventos: nombre, fecha, ubicación

---

## Paleta de colores

| Token      | Valor     | Uso                      |
|------------|-----------|--------------------------|
| Navy 900   | `#0a1628` | Fondo principal          |
| Navy 800   | `#112035` | Cards y formularios      |
| Navy 700   | `#1a304f` | Bordes y separadores     |
| Ice 50     | `#f0f6ff` | Texto principal          |
| Silver 400 | `#8892a4` | Texto secundario         |
| Gold 400   | `#d4af6a` | Acentos premium, precios |
