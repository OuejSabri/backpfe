const taskController = require('../controllers/tacheController');
const express = require('express');
const router = express.Router();

// Créer une nouvelle tâche
router.post("/", taskController.createTask);

// Obtenir toutes les tâches
router.get("/", taskController.getAllTasks);

// Obtenir une tâche par son ID
router.get("/:id", taskController.getTaskById);

router.get("/byoffre/:id", taskController.getTaskByIdOffre);

// Mettre à jour une tâche
router.put("/:id", taskController.updateTask);

// Supprimer une tâche
router.delete("/:id", taskController.deleteTask);

module.exports = router;
