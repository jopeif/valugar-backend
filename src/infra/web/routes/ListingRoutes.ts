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
router.post("/register/", (req, res) => container.listingController.create(req, res));

/**
 * @swagger
 * /listing/{id}:
 *   delete:
 *     summary: Deleta um anúncio pelo ID (somente admins ou dono do post)
 *     tags: [Listings]
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
 *         description: Anúncio deletado com sucesso
 */
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) => container.listingController.delete(req, res));

/**
 * @swagger
 * /listing/{id}:
 *   get:
 *     summary: Busca um anúncio pelo ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Anúncio encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FindListingByIdDTO'
 */
router.get("find/:id", (req, res) => {container.listingController.findById(req, res);});


//TERMINAR ESSA ROTA DEPOIS. INCOMPLETA!!

/**
 * @swagger
 * /listing/{id}:
 *   put:
 *     summary: Edita um anúncio já existente (NÃO FINALIZADO).
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListingDTOInput'
 *     responses:
 *       200:
 *         description: Anúncio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateListingDTOOutput'
 */
router.put("/:id", (req, res) => {
  container.listingController.update(req, res);
});

router.get("/search/", (req, res) => {
  container.listingController.searchListings(req, res);
});

router.get("/user/:id", (req, res) => {
  container.listingController.findListingByUser(req, res)
})



export default router;