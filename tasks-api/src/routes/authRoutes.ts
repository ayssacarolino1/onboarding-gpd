import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { requireAuth, requireEditor } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/cadastro", requireAuth, requireEditor, register);
router.post("/login", login);

export default router;
