"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import {
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from "../controllers/user.controller.js";


const router = Router();


router.use(authenticateJwt);
router.use(isAdmin);

router.get("/", getUsers);
router.get("/detail/:rut", getUser);
router.patch("/detail/:rut", updateUser);
router.delete("/detail/:rut", deleteUser);


export default router;
