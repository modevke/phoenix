/**
 * @swagger
 * components:
 *   parameters:
 *     attributesParam:
 *      in: query
 *      name: attributes
 *      description: The attributes you want to display. separate with ","
 *      schema:
 *        type: string
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     searchParam:
 *      in: query
 *      name: search
 *      description: Query of item in the table. Use "&" or "/"
 *      schema:
 *        type: string
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     sortParam:
 *      in: query
 *      name: sort
 *      description: Sort the table. use "ASC" or "DESC" eg "createdAt:ASC"
 *      schema:
 *        type: string
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     joinParam:
 *      in: query
 *      name: join
 *      description: Join multiple tables. 
 *      schema:
 *        type: string
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     rawParam:
 *      in: query
 *      name: raw
 *      description: Retrieve data in raw format
 *      schema:
 *        type: boolean
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     offsetParam:
 *      in: query
 *      name: offset
 *      description: The number of items to skip before starting to collect the result set
 *      schema:
 *        type: integer
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     limitParam:
 *      in: query
 *      name: limit
 *      description: The numbers of items to return
 *      schema:
 *        type: integer
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     SignIn:
 *       type: object
 *       required:
 *          - identifier
 *          - password
 *       properties:
 *         identifier:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *          identifier: "any"
 *          password: "any"
 */

export const SignInDto = {
    type: 'object',
    properties: {
        identifier: { type: 'string', maxLength: 255},
        password: { type: 'string', maxLength: 255},
      
    },
    required: ['identifier', 'password'],
    additionalProperties: false,
};
