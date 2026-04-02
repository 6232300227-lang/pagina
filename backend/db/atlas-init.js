const dbName = 'pagina_prod';

db = db.getSiblingDB(dbName);

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Nombre del usuario'
        },
        email: {
          bsonType: 'string',
          description: 'Email unico del usuario'
        },
        password: {
          bsonType: ['string', 'null'],
          description: 'Hash de la password o null para cuentas Google'
        },
        googleId: {
          bsonType: 'string',
          description: 'ID de Google para cuentas federadas'
        },
        emailVerified: {
          bsonType: 'bool',
          description: 'Indica si el email fue verificado'
        },
        registrationMethod: {
          enum: ['email', 'google'],
          description: 'Metodo de registro'
        },
        lastLogin: {
          bsonType: ['date', 'null'],
          description: 'Fecha del ultimo acceso'
        },
        isActive: {
          bsonType: 'bool',
          description: 'Indica si la cuenta esta activa'
        },
        phone: {
          bsonType: 'string',
          description: 'Telefono del usuario'
        },
        address: {
          bsonType: 'string',
          description: 'Direccion del usuario'
        },
        city: {
          bsonType: 'string',
          description: 'Ciudad del usuario'
        },
        zipCode: {
          bsonType: 'string',
          description: 'Codigo postal del usuario'
        },
        role: {
          enum: ['customer', 'admin'],
          description: 'Rol del usuario'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Fecha de creacion'
        }
      }
    }
  }
});

db.createCollection('cartitems', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        productId: {
          bsonType: 'string',
          description: 'Id del producto en frontend o catalogo'
        },
        name: {
          bsonType: 'string',
          description: 'Nombre visible del producto'
        },
        qty: {
          bsonType: ['int', 'long', 'double', 'decimal'],
          description: 'Cantidad agregada al carrito'
        },
        price: {
          bsonType: ['int', 'long', 'double', 'decimal'],
          description: 'Precio unitario'
        },
        userEmail: {
          bsonType: 'string',
          description: 'Email del usuario dueno del carrito'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Fecha de creacion'
        }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true, name: 'uniq_user_email' });
db.cartitems.createIndex({ userEmail: 1 }, { name: 'idx_cart_user_email' });
db.cartitems.createIndex({ productId: 1 }, { name: 'idx_cart_product_id' });

print(`Base de datos "${dbName}" inicializada correctamente.`);