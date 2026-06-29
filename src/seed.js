import { prisma } from "./db.js";
import bcrypt from "bcrypt";

async function main() {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
        data: {
            name: "Sebastian Cabrera",
            email: "sebaacabrera@example.com", 
            password: await bcrypt.hash("123456", 10)
        },
    });
    console.log("Usuario creado:", user);

    // Create TWO categories with DIFFERENT variable names
    const categoriaAlmacen = await prisma.category.create({
        data: { name: "almacen" }
    });
    console.log("Categoría creada:", categoriaAlmacen);

    const categoriaBebidas = await prisma.category.create({
        data: { name: "bebidas" }
    });
    console.log("Categoría creada:", categoriaBebidas);

    // Create products using different categories
    const product1 = await prisma.product.create({
        data: {
            name: "Fernet",
            price: 17500,
            quantity: 10,
            categoryId: categoriaBebidas.id,  // Fernet goes in bebidas
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: "tabaco",
            price: 3500,
            quantity: 20,
            categoryId: categoriaAlmacen.id,  // tabaco goes in almacen
        },
    });
    console.log("Productos creados:", product1, product2);

    const orden = await prisma.order.create({
        data: {
            userId: user.id,
            orderItems: {
                create: [
                    { productId: product1.id, cantidad: 2 },
                    { productId: product2.id, cantidad: 1 }
                ]
            }
        }
    });
    console.log("Orden creada:", orden);

    // Query: order with user, products, and categories
    const ordenCompleta = await prisma.order.findUnique({
        where: { id: orden.id },
        include: {
            user: true,
            orderItems: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        }
    });
    console.log("Orden completa:", JSON.stringify(ordenCompleta, null, 2));
}

main()
    .then(() => console.log("✅ Script terminado"))
    .catch((e) => console.error("❌ Error:", e))
    .finally(() => prisma.$disconnect());