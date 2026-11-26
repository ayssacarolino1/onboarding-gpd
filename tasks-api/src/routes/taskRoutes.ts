import { Router } from "express";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addBlocker,
  removeBlocker,
  moveTask
} from "../controllers/taskController.js";
import { requireAuth, requireEditor } from "../middlewares/auth.js";


const router: Router = Router();

router.get("/", requireAuth, listTasks);
router.get("/:id", requireAuth, getTask);
router.post("/", requireAuth, requireEditor, createTask);
router.patch("/:id", requireAuth, requireEditor, updateTask);
router.delete("/:id", requireAuth, requireEditor, deleteTask);
router.post("/:id/blockers", requireAuth, requireEditor, addBlocker);
router.delete("/:id/blockers/:blockerId", requireAuth, requireEditor, removeBlocker);
router.patch("/:id/status", requireAuth, requireEditor, moveTask);

export default router;