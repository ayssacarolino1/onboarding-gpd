import { Router } from "express";
import { register, login, listUsers, getUser, deleteUser } from "../controllers/authController.js";
import { requireAuth, requireEditor } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/cadastro", requireAuth, requireEditor, register);
router.get("/usuarios", requireAuth, requireEditor, listUsers);
router.get("/usuarios/:id", requireAuth, requireEditor, getUser);
router.delete("/usuarios/:id", requireAuth, requireEditor, deleteUser);
router.post("/login", login);


export default router;
