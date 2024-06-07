const express = require("express");
const Router = express.Router();

const {
  getAllAdvertisements,
  getAdvertisement,
  getAdvertisementsByUserID,
  createAdvertisement,
  updateAdvertisement,
  removeAdvertisement,
  filterAdvertisements,
} = require("../controllers/advertisementController");

const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// İlan rotaları için giriş yapma gereksinimi gerekliliği için kullanılan middleware
Router.use(authenticateToken);


/**
 * GET /advertisements
 * İlanlar koleksiyonundaki bütün ilanları döndürür.
 */
/**
 * @openapi
 * /advertisements:
 *   get:
 *     tags:
 *       - Advertisement Controller
 *     summary: İlanlar koleksiyonundaki bütün ilanları döndürür.
 *     security:
 *        - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Bütün ilanlar başarıyla getirildi.
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
 *                   example: Bütün ilanlar başarıyla getirildi!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       title:
 *                         type: string
 *                         example: "Satılık araba"
 *                       description:
 *                         type: string
 *                         example: "Çok temiz, az kullanılmış araba."
 *                       price:
 *                         type: number
 *                         example: 50000
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T00:00:00.000Z
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
 *                   example: Hata mesajı!
 */

Router.get("/", getAllAdvertisements);


/**
 * GET /advertisements/user
 * Belirli bir kullanıcının favori ilanlarını ve sahip olduğu ilanları döndürür..
 */
/**
 * @openapi
 * /advertisements/user: 
 *   get:
 *     tags:
 *       - Advertisement Controller
 *     summary: Kullanıcı bilgilerini ID ile getirmek için kullanılır.
 *     security:
 *        - bearerAuth: [] 
 *     description: Kullanıcı ID'sini kullanarak o kullanıcıya ait olan ilanları getirir.
 *     responses:
 *       200:
 *         description: Kullanıcının ilanları başarıyla çekildi.
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
 *                   example: Kullanıcı ilanları başarıyla getirildi!
 *                 data:
 *                   type: object
 *                   properties:
 *                     ownAdvertisements:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Advertisement'
 *                     favoriteAdvertisements:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Advertisement'
 *       500:
 *         description: Sunucu hatası!
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
 *                   example: Hata mesajı!
 */

Router.get("/user", getAdvertisementsByUserID); 

/**
 * POST /advertisements/create
 * Yeni bir ilan oluşturur ve ilanı oluşturan kullanıcının ilanlarına ekler.
 */
/**
 * @openapi
 * /advertisements/create:
 *   post:
 *     tags:
 *       - Advertisement Controller
 *     summary: Yeni bir ilan oluşturur
 *     security:
 *        - bearerAuth: []  
 *     description: Yeni bir ilan oluşturur ve ilanı oluşturan kullanıcının ilanlarına ekler.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertisementRequestBody'
 *     responses:
 *       201:
 *         description: İlan başarıyla oluşturuldu
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
 *                   example: Advertisement created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
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
 */

Router.post("/create", createAdvertisement);

/**
 * GET /advertisements/filter
 * Belirlenen filtrelere göre ilanları listeler.
 */
/**
 * @openapi
 * /advertisements/filter:
 *   get:
 *     tags:
 *       - Advertisement Controller
 *     summary: İlanları filtreler
*     security:
 *        - bearerAuth: [] 
 *     description: Belirli kriterlere göre ilanları filtreler.
 *     parameters:
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: integer
 *         description: Minimum fiyat
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: integer
 *         description: Maksimum fiyat
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: "Başlık"
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *         description: Fiyat sıralaması (ascending veya descending)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Tarih sıralaması (ascending veya descending)
 *     responses:
 *       201:
 *         description: Filtrelenmiş ilanlar başarıyla getirildi
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
 *                   example: Filtrelenmiş ilanlar başarıyla getirildi!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Advertisement'
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
 *                   example: İlanları filtrelerken bir hata meydana geldi!
 *                 error:
 *                   type: string
 */


Router.get("/filter", filterAdvertisements);

/**
 * GET /advertisements/{id}
 * Belirli bir kullanıcının favori ilanlarını ve sahip olduğu ilanları döndürür..
 */
/**
 * @openapi
 * /advertisements/{id}:
 *   get:
 *     tags:
 *       - Advertisement Controller
 *     summary: Belirli bir ilanı ilan ID'sini kullanarak çeker.
 *     description: İlan ID'sini kullanarak o ilan ile ilgili detayları getirir.
 *     security:
 *        - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Getirilmek istenen ilanın ID'si.
 *     responses:
 *       200:
 *         description: İlan başarıyla getirildi
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
 *                   example: İlan başarıyla getirildi!
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 *       404:
 *         description: İlan bulunamadı
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
 *                   example: İlan bulunamadı!
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
 *                   example: Hata mesajı
 * 
 */

Router.get("/:id", getAdvertisement); 

/**
 * PUT /advertisements/{id}
 * Belirlenen ilan ID'sine sahip olan ilanı kaldırır.
 */
/**
 * @openapi
 * /advertisements/{id}:
 *   put:
 *     tags:
 *       - Advertisement Controller
 *     summary: İlanı günceller
 *     security:
 *        - bearerAuth: []  
 *     description: ID'si verilen ilanı günceller ve güncellenmiş halini döndürür.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Güncellenecek ilanın ID'si
 *       - in: body
 *         name: body
 *         required: true
 *         description: Güncellenecek ilanın yeni verileri
 *         schema:
 *           $ref: '#/components/schemas/AdvertisementUpdateRequestBody'
 *     responses:
 *       200:
 *         description: İlan başarıyla güncellendi
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
 *                   example: Advertisement updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 *       404:
 *         description: İlan bulunamadı
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
 *                   example: İlan bulunamadı!
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
 *                   example: Hata mesaj
 */

Router.put("/:id", updateAdvertisement);

/**
 * DELETE /advertisements/remove
 * Belirlenen ilan ID'sine sahip olan ilanı kaldırır.
 */
/**
 * @openapi
 * /advertisements/remove:
 *   delete:
 *     tags:
 *       - Advertisement Controller
 *     summary: Belirlenen ilan ID'sine sahip olan ilanı siler.
 *     security:
 *        - bearerAuth: []  
 *     description: ID'si verilen ilanı siler.
 *     parameters:
 *       - in: query
 *         name: id 
 *         schema:
 *           type: string
 *         required: true
 *         description: İlanı silinmek istenen kullanıcının ID'si.
 *     responses:
 *       200:
 *         description: İlan başarıyla silindi
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
 *                   example: İlan başarıyla silindi!
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 *       404:
 *         description: İlan bulunamadı
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
 *                   example: İlan bulunamadı!
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
 */

Router.delete("/remove", removeAdvertisement);

module.exports = Router;
