import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router: Router = Router();

router.post("/cadastro", register);
router.post("/login", login);

export default router;
