import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error) {
                console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        const passwordValido = await bcrypt.compare(password, user.password);

        if (!passwordValido) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login exitoso", token });

    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión." });
    }
});
export default router;