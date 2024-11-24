"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js"; 
import {
    getUser,
    getUsers,
    updateUser,
} from "../controllers/user.controller.js";

const router = Router();


router.use(authenticateJwt);


router.get("/", authorizeRoles("admin", "profesor"), getUsers); 
router.get("/detail/:id", authorizeRoles("admin", "profesor"), getUser); 
router.patch("/detail/:id", authorizeRoles("admin", "profesor"), updateUser); 

export default router;
