const dbName = 'pagina_prod';

db = db.getSiblingDB(dbName);

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password'],
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
          bsonType: 'string',
          description: 'Hash de la password'
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