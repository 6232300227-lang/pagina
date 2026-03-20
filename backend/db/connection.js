const mongoose = require('mongoose');

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
  console.log(`MongoDB connected to database "${mongoose.connection.name}"`);
}

module.exports = { connectDB };
