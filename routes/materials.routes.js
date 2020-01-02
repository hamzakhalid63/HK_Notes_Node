const express = require("express");
const checkAuth = require('../middleware/check-auth');
const MaterialController = require('../controllers/materials.controllers');
const router = express.Router();

router.get("/",checkAuth,MaterialController.getAll);
router.post("/add",checkAuth,MaterialController.addMaterial);
router.put("/:_id",checkAuth, MaterialController.updateMaterial);
router.delete("/:_id",checkAuth, MaterialController.deleteMaterial);

module.exports = router;
