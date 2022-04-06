import express from "express";
import applyInternController from "../controllers/applyInternController";

const router = express.Router();

router.patch("/intern/support", applyInternController.signUpCVForSupport);

module.exports = router;
