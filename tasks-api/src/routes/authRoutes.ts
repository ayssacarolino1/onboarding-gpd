import { Router } from "express";
import { register } from "../controllers/authController.js";

const router: Router = Router();

router.post("/cadastro", register);

export default router;
