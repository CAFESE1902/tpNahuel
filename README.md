# nodejs-prisma-restapi-main_final
API REST con Node.js, Express y Prisma (MySQL). Incluye autenticación JWT y frontend con HTML/CSS/JS.
# TP Integrador — API REST con Node.js, Express y Prisma

API REST desarrollada con Node.js, Express y Prisma ORM conectada a una base de datos MySQL. El proyecto modela un sistema de órdenes de compra con usuarios, productos y categorías.

---

## Tecnologías utilizadas

- **Node.js** — entorno de ejecución
- **Express** — framework para crear la API REST
- **Prisma ORM** — acceso a la base de datos
- **MySQL** — motor de base de datos
- **bcrypt** — encriptación de contraseñas
- **jsonwebtoken** — autenticación con tokens JWT

---

## Modelo de datos

El sistema cuenta con cinco entidades relacionadas entre sí:

### Entidades

**Category** — categoría de productos
- `id`, `name`

**Product** — producto del sistema
- `id`, `name`, `quantity`, `price`, `createdAt`, `categoryId`

**User** — usuario del sistema
- `id`, `name`, `email`, `password`

**Order** — orden de compra realizada por un usuario
- `id`, `fecha`, `userId`

**OrderItem** — detalle de una orden (relación entre Order y Product)
- `id`, `cantidad`, `orderId`, `productId`

### Relaciones

```
Category  ──(1:N)──►  Product  ──(1:N)──►  OrderItem
                                                ▲
User  ──(1:N)──►  Order  ──(1:N)──────────────►┘
```

- Una categoría tiene muchos productos.
- Un usuario puede tener muchas órdenes.
- Una orden puede contener muchos ítems (OrderItem).
- Un OrderItem referencia un producto específico.
- La relación entre Order y Product es muchos a muchos, resuelta mediante OrderItem.

---

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js v18 o superior
- MySQL corriendo localmente

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/CAFESE1902/tpNahuel.git
cd tpNahuel
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

Copiá el archivo de ejemplo y completá los datos de tu base de datos:

```bash
cp .env.example .env
```

Editá el `.env` con tus credenciales de MySQL:

```env
DATABASE_URL="mysql://root:root@localhost:3306/app_db"
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=app_db
JWT_SECRET=una_clave_secreta
```

**4. Ejecutar las migraciones**

Esto crea las tablas en la base de datos:

```bash
npx prisma migrate dev
```

**5. Cargar datos de prueba (opcional)**

```bash
node src/seed.js
```

**6. Levantar el servidor**

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

---

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| POST | `/api/products` | Crear un producto |
| GET | `/api/products/:id` | Obtener un producto por ID |
| PATCH | `/api/products/:id` | Actualizar un producto |
| DELETE | `/api/products/:id` | Eliminar un producto |
| GET | `/api/categories` | Obtener todas las categorías |
| POST | `/api/register` | Registrar un usuario |
| POST | `/api/login` | Iniciar sesión |
