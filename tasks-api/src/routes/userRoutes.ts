import { Router } from "express";
import { listUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { requireAuth, requireEditor } from "../middlewares/auth.js";

const router: Router = Router();

router.get("/", requireAuth, requireEditor, listUsers);
router.patch("/:id", requireAuth, requireEditor, updateUser);
router.delete("/:id", requireAuth, requireEditor, deleteUser);

export default router;