import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { executeMiddleware } from "../../../middleware";
import { SignInDto } from "./user.dto";

export const userControllerRouter = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - user
 *     parameters:
 *       - $ref: '#/components/parameters/attributesParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - $ref: '#/components/parameters/joinParam'
 *       - $ref: '#/components/parameters/rawParam'
 *       - $ref: '#/components/parameters/offsetParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     summary: Retrieve multiple users
 *     description: Permissions => **[can_retrieve_many_users]** </br> Attributes => **[id, firstName, lastName, email, phone, dateOfBirth, address, active, searchable, tags, extendedUserData, createdAt, updatedAt, deletedAt]** </br> Joins => **[User]**
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.get(
  "/",
  executeMiddleware({
    auth: true,
    label: "Retrieve multiple users",
  }),
  UserService.fetchManyUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User id
 *         schema:
 *           type: integer
 *       - $ref: '#/components/parameters/attributesParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - $ref: '#/components/parameters/joinParam'
 *       - $ref: '#/components/parameters/rawParam'
 *     summary: Retrieve one user
 *     description: Permissions => **[can_retrieve_one_user]** </br> Attributes => **[id, firstName, lastName, email, phone, dateOfBirth, address, active, searchable, tags, extendedUserData, createdAt, updatedAt, deletedAt]** </br> Joins => **[User]**
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.get(
  "/:id",
  executeMiddleware({
    auth: true,
    label: "Retrieve one user by id",
  }),
  UserService.fetchUserById
);

/**
 * @swagger
 * /api/users/sign-in:
 *   post:
 *     tags:
 *       - user
 *     summary: User sign in

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignIn'
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.post(
  "/sign-in",
  executeMiddleware({
    auth: true,
    label: "User Sign In",
    validation: SignInDto
  }),
  UserService.userSignIn
);

userControllerRouter.post("/check-id", async (req, res) => {});

userControllerRouter.post("/reset-password", async (req, res) => {});

userControllerRouter.patch("/:id", async (req, res) => {});

userControllerRouter.delete("/:id", async (req, res) => {});
