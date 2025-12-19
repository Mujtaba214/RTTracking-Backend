import express from "express";
import { getRoute } from "../controller/locatonController.js";

const router = express.Router()

router.post('/route',getRoute)
export default router