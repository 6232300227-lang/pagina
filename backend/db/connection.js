const mongoose = require('mongoose');

const USER_COLLECTION_VALIDATOR = {
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
};

function ensureDatabaseInUri(uri, dbName) {
  // If URI already contains a database segment (e.g. /mydb or /mydb?params) return as-is
  // Match a slash followed by non-slash chars before optional ? or end
  if (/\/[^\/?]+(\?|$)/.test(uri)) return uri;

  // Insert the database name before query string if present
  const qIdx = uri.indexOf('?');
  if (qIdx === -1) return uri.replace(/\/$/, '') + '/' + dbName;
  return uri.slice(0, qIdx).replace(/\/$/, '') + '/' + dbName + uri.slice(qIdx);
}

async function connectDB() {
  let uri = process.env.MONGODB_URI;
  if (uri) {
    uri = ensureDatabaseInUri(uri, 'pagina_prod');
  } else {
    uri = 'mongodb://127.0.0.1:27017/pagina_prod';
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    await mongoose.connection.db.command({
      collMod: 'users',
      validator: USER_COLLECTION_VALIDATOR,
      validationLevel: 'moderate'
    });
  } catch (err) {
    if (err?.codeName !== 'NamespaceNotFound') {
      throw err;
    }
  }

  console.log(`MongoDB connected to database "${mongoose.connection.name}"`);
}

module.exports = { connectDB };
