import { Router, Request, Response } from "express";
import { UserService } from "./user.service";
import { executeMiddleware } from "../../../strategies/middleware";
import {
  ResetPasswordDto,
  SignInDto,
  UpdateUserDto,
  VerifyUserEsbDto,
} from "./user.dto";

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
    auth: false,
    label: "User Sign In",
    validation: SignInDto,
  }),
  UserService.userSignIn
);

/**
 * @swagger
 * /api/users/verify-user-esb:
 *   post:
 *     tags:
 *       - user
 *     summary: Verify user in esb

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyUserEsb'
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.post(
  "/verify-user-esb",
  executeMiddleware({
    auth: false,
    label: "Verify user in esb",
    validation: VerifyUserEsbDto,
  }),
  UserService.verifyUserFromESB
);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     tags:
 *       - user
 *     summary: Reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.post(
  "/reset-password",
  executeMiddleware({
    auth: false,
    label: "Reset password",
    validation: ResetPasswordDto,
  }),
  UserService.resetUserPassword
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags:
 *       - user
 *     summary: Update one user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User id
 *         schema:
 *           type: integer
 *       - in: header
 *         name: idempotence-token
 *         required: true
 *         description: Ensure that a request can only be processed once, even if the client retries due to network errors or other issues.
 *         type: string
 *     description: Permissions => **[can_update_user]**
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Success response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
userControllerRouter.patch(
  "/:id",
  executeMiddleware({
    auth: false,
    label: "Update one user",
    validation: UpdateUserDto,
    idempotence: true,
  }),
  UserService.updateUser
);

/**
 * @swagger
 * /user-api/users/{id}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Delete one user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User id
 *         schema:
 *           type: integer
 *       - in: header
 *         name: idempotence-token
 *         required: true
 *         description: Ensure that a request can only be processed once, even if the client retries due to network errors or other issues.
 *         type: string
 *     description: Permissions => **[can_delete_user]**
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
userControllerRouter.delete(
  "/:id",
  executeMiddleware({
    auth: false,
    label: "Delete one user",
    idempotence: true,
  }),
  UserService.deleteUser
);
