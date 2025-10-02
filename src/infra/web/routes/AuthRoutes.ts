import { Router } from "express";
import { ContainerFactory } from "../../../di/containerFactory";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();
const container = ContainerFactory.getContainer();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token JWT usado para autenticar requisições na API
 *                 refreshToken:
 *                   type: string
 *                   description: Token usado para renovar o accessToken quando ele expira
 */
router.post("/login", (req, res) => container.authController.login(req, res));


/**
 * @swagger
 * /auth/user/register:
 *   post:
 *     summary: Registra um usuário normal
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDTO'
 *     responses:
 *       200:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do usuário registrado
 */
router.post("/user/register", (req, res) => container.authController.registerUser(req, res));

/**
 * @swagger
 * /auth/admin/register:
 *   post:
 *     summary: Registra um administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminDTO'
 *     responses:
 *       200:
 *         description: Administrador registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do admin registrado
 */
router.post("/admin/register", (req, res) => container.authController.registerAdmin(req, res));

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Retorna todos os usuários (somente admins)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 */
router.get("/user", adminMiddleware, (req, res) => container.authController.findAllUsers(req, res));

/**
 * @swagger
 * /auth/user/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID (somente admins)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 */
router.delete("/user/:id", adminMiddleware, (req, res) => container.authController.deleteUser(req, res));

/**
 * @swagger
 * /auth/user/id/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.get("/user/id/:id", (req, res) => container.authController.findUserById(req, res));

/**
 * @swagger
 * /auth/user/email/{email}:
 *   get:
 *     summary: Retorna um usuário pelo email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.get("/user/email/:email", (req, res) => container.authController.findUserByEmail(req, res));

export default router;
