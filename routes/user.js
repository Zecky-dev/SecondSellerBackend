const express = require("express");
const Router = express.Router();

const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// User route'ları buraya eklenecek
const {
  register,
  login,
  getUser,
  sendEmailVerification,
  favoriteUnfavorite,
  updateUser,
  passwordReset,
  updatePassword,
  changePassword,
  blockUser,
} = require("../controllers/userController.js");


/**
 * GET /user/{id}
 * Kullanıcı bilgilerini getirmek için kullanılır.
 */
/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - User Controller
 *     summary: Kullanıcı bilgilerini ID kullanarak getirmek için kullanılır.
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kullanıcı ID'si
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri başarıyla alındı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı bulunamadı!
*       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı getirilirken hata meydana geldi!
 *                 error:
 *                   type: string
 *                   example: Hata mesajı
 */

Router.get("/:id", getUser);

/**
 * PUT /user/{id}/updateUser
 * Kullanıcıyı güncellemek için kullanılır.
 */
/**
 * @openapi
 * /user/{id}/updateUser:
 *   put:
 *     tags:
 *       - User Controller
 *     summary: Kullanıcı bilgilerini günceller
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kullanıcı ID'si
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       404:
 *         description: Belirtilen kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı bulunamadı!
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
*       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Sunucu hatası!
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 */

Router.put("/:id/updateUser", updateUser);

/**
 * PUT /user/{id}/changePassword
 * Kullanıcının şifresini değiştirmek için kullanılır.
 */
/**
 * @openapi
 * /{id}/changePassword:
 *   put:
 *     tags:
 *       - User Controller
 *     summary: Kullanıcının şifresini değiştirir
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kullanıcı ID'si
 *         schema:
 *           type: string
 *           format: objectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Kullanıcının mevcut şifresi
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 description: Kullanıcının yeni şifresi
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Şifre değişikliği başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Şifre değiştirme başarılı!
 *                 data:
 *                   type: string
 *                   example: "token value"
 *       404:
 *         description: Belirtilen kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı bulunamadı!
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Şifre değiştirirken bir hata meydana geldi.
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 */


Router.put("/:id/changePassword", changePassword);

/**
 * POST /user/updatePassword
 * Kullanıcının şifresini güncellemek için kullanılır.
 */
/**
 * @openapi
 * /updatePassword:
 *   put:
 *     tags:
 *       - User Controller
 *     summary: Kullanıcının şifresini günceller
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "zkcndnmez@gmail.com"
 *               newPassword:
 *                 type: string
 *                 description: Kullanıcının yeni şifresi
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Şifre değişikliği başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Şifre değiştirme başarılı!
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı bulunamadı!
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Şifre güncelleme esnasında hata meydana geldi!
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 */


Router.put("/updatePassword", authenticateToken,updatePassword)


/**
 * POST /user/login
 * Kullanıcı girişi için kullanılır.
 */
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Kullanıcı giriş yapar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "zkcndnmez@gmail.com"
 *               password:
 *                 type: string
 *                 description: Kullanıcının şifresi
 *                 example: "test1234"
 *     responses:
 *       200:
 *         description: Login successful!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjE3Yjg0ODI5ZjRjMDUxMjU3NWUxMDkiLCJpYXQiOjE3MTY3MTYwNDMsImV4cCI6MTcxNjgwMjQ0M30.1BjOpgGs-Q870yRgD0kHgsHsX5-00MMLQXD8XRjWhec"
 *       401:
 *         description: E-posta adresi veya şifre hatalı veya inaktif kullanıcı!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: E-posta adresi veya şifre hatalı veya inaktif kullanıcı!
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Giriş yaparken bir hata meydana geldi!
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 */

Router.post("/login", login);

/**
 * POST /user/register
 * Kullanıcı kaydı için kullanılır.
 */
/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Yeni kullanıcı kaydı oluşturur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameSurname:
 *                 type: string
 *                 description: Kullanıcının isim ve soyismi
 *                 example: "Zekeriya Dönmez"
 *               phoneNumber:
 *                 type: string
 *                 description: Kullanıcının telefon numarası
 *                 example: "0505 988 01 49"
 *               emailAddress:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "zkcndnnmez@gmail.com"
 *               password:
 *                 type: string
 *                 description: Kullanıcının şifresi
 *                 example: "test1234"
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturma başarılı!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Kullanıcı oluşturma başarılı!
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUzMDMxMDBkNjQxODhjNDRhYjMwOGYiLCJpYXQiOjE3MTY3MTYzMDQsImV4cCI6MTcxNjgwMjcwNH0.Hzc4ZN2yrYKV18r3glt4PuouBLWQ4HtoWaBl-mX3PT0"
 *       409:
 *         description: Kullanıcı zaten mevcut!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı zaten mevcut!
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Kullanıcı oluşturulurken bir hata meydana geldi!.
 *                 error:
 *                   type: string
 *                   example: "Hata mesajı"
 */


Router.post("/register", register);

Router.put("/favoriteUnfavorite" , favoriteUnfavorite);
Router.put("/block", authenticateToken ,blockUser);
Router.get("/passwordReset", passwordReset);
Router.post("/sendEmailVerification", sendEmailVerification);

module.exports = Router;
