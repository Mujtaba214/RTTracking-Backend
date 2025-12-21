import express from "express";
import { getRoute, updateLocation } from "../controller/locatonController.js";

const router = express.Router()


router.post('/update', updateLocation);
router.get('/users', getAllUsers);
router.post('/route', getRoute);

export default router