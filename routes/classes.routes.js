const express = require("express");
const checkAuth = require('../middleware/check-auth');
const ClassController = require('../controllers/classes.controllers');
const router = express.Router();

// Class Specific Routes
router.get("/", checkAuth, ClassController.getAll);
router.get("/:_id", checkAuth,ClassController.getSingleClassByClassId);
router.get("/users/:userId", checkAuth,ClassController.getSingleClassByUserId);
router.put("/:_id", checkAuth, ClassController.updateClass);
router.delete("/:_id", checkAuth, ClassController.deleteClass);
// router.post("/",ClassController.addClass);

// router.get("/currentUser", checkAuth, ClassController.getCurrentUser);
router.delete("/users/:userId", checkAuth, ClassController.deleteUser);

// Class Specific Routes
router.get("/:key/users", checkAuth, ClassController.getAllUsersByKey);

module.exports = router;
