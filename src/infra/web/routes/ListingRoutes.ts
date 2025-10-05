import { Router } from "express";
import { ContainerFactory } from "../../../di/containerFactory";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const container = ContainerFactory.getContainer();

/**
 * @swagger
 * /listing/register:
 *   post:
 *     summary: Cria um novo anúncio
 *     tags: [Listings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterListingDTO'
 *     responses:
 *       200:
 *         description: Anúncio registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do anúncio registrado
 */
router.post("/register/", authMiddleware, (req, res) => container.listingController.create(req, res));

export default router;