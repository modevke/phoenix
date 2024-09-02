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

/**
 * @swagger
 * components:
 *   schemas:
 *     VerifyUserEsb:
 *       type: object
 *       required:
 *          - IDNo
 *       properties:
 *         IDNo:
 *           type: string
 *       example:
 *          IDNo: "any"
 */

export const VerifyUserEsbDto = {
    type: 'object',
    properties: {
        IDNo: { type: 'string', maxLength: 255}
    },
    required: ['IDNo'],
    additionalProperties: false,
};


/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPassword:
 *       type: object
 *       required:
 *          - identifier
 *          - otp
 *          - password
 *       properties:
 *         identifier:
 *           type: string
 *         otp:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *          identifier: "any"
 *          otp: "any"
 *          password: "any"
 */
export const ResetPasswordDto = {
    type: 'object',
    properties: {
        identifier: { type: 'string', maxLength: 255},
        otp: { type: 'string', maxLength: 255},
        password: { type: 'string', maxLength: 255},
      
    },
    required: ['identifier', 'otp', 'password'],
    additionalProperties: false,
};


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUser:
 *       type: object
 *       required:
 *          - firstName
 *          - lastName
 *          - email
 *          - phone
 *          - dateOfBirth
 *          - active
 *          - searchable
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         address:
 *           type: string
 *         active:
 *           type: number
 *         searchable:
 *           type: boolean
 *         tags:
 *           type: string
 *         extendedUserData:
 *           type: string
 *       example:
 *          firstName: "any"
 *          lastName: "any"
 *          email: "any@any.com"         
 *          phone: "25412345678"
 *          dateOfBirth: "2024-05-11"
 *          address: "any"
 *          active: "Active"
 *          searchable: true
 *          tags: "any"
 *          extendedUserData: "any"
 */

export const UpdateUserDto = {
    type: 'object',
    properties: {
        firstname: { type: 'string', maxLength: 255},
        lastName: { type: 'string', maxLength: 255, nullable: false },
        email: { type: 'string', maxLength: 255, nullable: false },
        phone: { type: 'string', maxLength: 80, nullable: false },
        dateOfBirth: { type: 'string', format: "date", nullable: false },
        address: { type: 'string', maxLength: 255, nullable: false },
        active: { type: 'number', nullable: false },
        searchable: { type: 'boolean', default: false },
        tags: { type: 'string', maxLength: 80, nullable: false },
        extendedUserData: { type: 'string', maxLength: 80, nullable: false },
    },
    required: ['name', 'administrative, firstName, lastName, email, phone, dateOfBirth, active, searchable'],
    additionalProperties: false,
};
