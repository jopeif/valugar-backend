import { Router } from "express";
import { ContainerFactory } from "../../../di/containerFactory";

const router = Router();
const container = ContainerFactory.getContainer();


router.post("/login", (req, res) => { container.authController.login(req, res) });

// @ts-ignore //to be implemented in the future
router.post("/refresh-token", (req, res) => { container.authController.refreshToken(req, res) });

// @ts-ignore //to be implemented in the future
router.post("/logout", (req, res) => { container.authController.logout(req, res) });

router.post("/user/register", (req, res) => { container.authController.registerUser(req, res) });


export default router;