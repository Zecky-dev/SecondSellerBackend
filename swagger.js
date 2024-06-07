const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      swagger: "2.0",
      title: "SecondSeller API",
      description:
        "SecondSeller REST API developed for SecondSeller mobile application.",
      contact: {
        name: "SecondSeller",
        email: "info.secondseller@gmail.com",
        url: "https://github.com/Zecky-dev/_SecondSellerBackend",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local Server",
      },
      {
        url: "https://secondsellerbackend-production.up.railway.app/",
        description: "Live server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Advertisement: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "İlan ID'si",
              example: "60d0fe4f5311236168a109ca",
            },
            title: {
              type: "string",
              description: "İlan başlığı",
              example: "iPhone 15 Pro",
            },
            description: {
              type: "string",
              description: "İlan açıklaması",
              example: "Az kullanılmış iPhone 15 Pro.",
            },
            price: {
              type: "number",
              description: "İlan fiyatı",
              example: 35000,
            },
            owner: {
              type: "string",
              description: "İlanı paylaşan kullanıcının ID'si",
              example: "60cf6ef36c11fa7b8c8b4567",
            },
            createDate: {
              type: "string",
              format: "date-time",
              description: "İlanın oluşturulma tarihi",
              example: "2024-05-21T12:34:56Z",
            },
            location: {
              type: "object",
              properties: {
                latitude: {
                  type: "number",
                  description: "İlanın enlem değeri",
                  example: 41.0082,
                },
                longitude: {
                  type: "number",
                  description: "İlanın boylam değeri",
                  example: 28.9784,
                },
              },
              description: "İlanın konumu",
            },
            category: {
              type: "string",
              description: "İlan kategorisi",
              example: "Elektronik",
            },
            soldStatus: {
              type: "boolean",
              description: "İlanın satış durumu",
              example: false,
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "İlan görselleri",
              example: ["image1.jpg", "image2.jpg"],
            },
          },
        },
        AdvertisementRequestBody: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "İlan başlığı",
              example: "iPhone 15 Pro",
            },
            owner: {
              type: "string",
              description: "İlanı paylaşan kullanıcının ID'si",
              example: "60cf6ef36c11fa7b8c8b4567",
            },
            description: {
              type: "string",
              description: "İlan açıklaması",
              example: "Az kullanılmış iPhone 15 Pro.",
            },
            price: {
              type: "number",
              description: "İlan fiyatı",
              example: 35000,
            },
            location: {
              type: "object",
              properties: {
                latitude: {
                  type: "number",
                  description: "İlanın enlem değeri",
                  example: 41.0082,
                },
                longitude: {
                  type: "number",
                  description: "İlanın boylam değeri",
                  example: 28.9784,
                },
              },
              description: "İlanın konumu",
            },
            category: {
              type: "string",
              description: "İlan kategorisi",
              example: "Elektronik",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "İlan görselleri",
              example: [
                "https://i.ibb.co/qYJ3kFN/79ed0c14-ea39-4121-8f9a-0a2356d14a75.jpg",
                "https://i.ibb.co/ph6sv4K/3321aa6b-5dac-4daf-9230-2c02984e4783.jpg",
              ],
            },
          },
        },
        AdvertisementUpdateRequestBody: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "İlan başlığı",
              example: "iPhone 15 Pro",
            },
            description: {
              type: "string",
              description: "İlan açıklaması",
              example: "Az kullanılmış iPhone 15 Pro.",
            },
            price: {
              type: "number",
              description: "İlan fiyatı",
              example: 35000,
            },
            location: {
              type: "object",
              properties: {
                latitude: {
                  type: "number",
                  description: "İlanın enlem değeri",
                  example: 41.0082,
                },
                longitude: {
                  type: "number",
                  description: "İlanın boylam değeri",
                  example: 28.9784,
                },
              },
              description: "İlanın konumu",
            },
            category: {
              type: "string",
              description: "İlan kategorisi",
              example: "Elektronik",
            },
            soldStatus: {
              type: "boolean",
              description: "İlanın satış durumu",
              example: false,
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "İlan görselleri",
              example: [
                "https://i.ibb.co/qYJ3kFN/79ed0c14-ea39-4121-8f9a-0a2356d14a75.jpg",
                "https://i.ibb.co/ph6sv4K/3321aa6b-5dac-4daf-9230-2c02984e4783.jpg",
              ],
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Kullanıcı ID'si",
              example: "6617b84829f4c0512575e109",
            },
            nameSurname: {
              type: "string",
              description: "Kullanıcı isim ve soyisimi.",
              example: "Zekeriya Dönmez",
            },
            phoneNumber: {
              type: "string",
              description: "Kullanıcı telefon numarası.",
              example: "5059880137",
            },
            activeStatus: {
              type: "boolean",
              description: "Kullanıcı hesabının aktiflik durumu.",
              example: true,
            },
            password: {
              type: "string",
              description: "Kullanıcı hesap şifresi.",
              example:
                "$2b$10$Cj5JK8Cc0kvh.8pyfIg4s.GYiaJC8VxNQh2dNkVhEP22f5TdA9gfG",
            },
            emailAddress: {
              type: "string",
              description: "Kullanıcı hesap e-posta adresi.",
              example: "zkcndnmez@gmail.com",
            },
            createDate: {
              type: "string",
              format: "date-time",
              description: "Kullanıcı hesap oluşturma tarihi.",
              example: "2024-04-11T10:11:54.879Z",
            },
            imageURL: {
              type: "string",
              description: "Kullanıcı profil resmi URL'si",
              example:
                "https://i.ibb.co/X3Q7mQ4/58962953-33c5-4550-9cd1-7041b24ab34b.jpg",
            },
            favorites: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Favori ilanlar",
              example: ["663dcf9a7d8e7a37b5904e97", "663dcf9a7d8e7a37b5904e95"],
            },
            advertisements: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Kullanıcı ilanları",
              example: ["663dcf9a7d8e7a37b5904e25"],
            },
            messageRooms: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Mesaj odaları",
              example: ["223dcf9a7d8e7a37b5904e25"],
            },
            blocked: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Engellenmiş kullanıcılar",
              example: ["663dcf9a7d8e7a37b590453"],
            },
          },
        },        
        UpdateUserRequest: {
          type: "object",
          properties: {
            nameSurname: {
              type: "string",
              description: "Kullanıcının isim ve soyismi",
              example: "Zekeriya Donmez"
            },
            phoneNumber: {
              type: "string",
              description: "Kullanıcının telefon numarası",
              example: "5059880137"
            },
            activeStatus: {
              type: "boolean",
              description: "Kullanıcının aktiflik durumu",
              example: true
            },
            emailAddress: {
              type: "string",
              description: "Kullanıcının e-posta adresi",
              example: "zkcndnmez@gmail.com"
            },
            imageURL: {
              type: "string",
              description: "Kullanıcının profil resmi URL'si",
              example: "https://i.ibb.co/zGRrp2J/c9da6a20-873d-4f68-b26e-54ac7a1ff523.jpg"
            }
          }
        },
        UpdateUserResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Durum",
              example: "success"
            },
            message: {
              type: "string",
              description: "Mesaj",
              example: "User fetched successfully!"
            },
            data: {
              $ref: "#/components/schemas/User"
            }
          }
        }



      },
    },
  },
  // looks for configuration in specified directories
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
module.exports = swaggerDocs;
