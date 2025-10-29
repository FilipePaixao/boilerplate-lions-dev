require('dotenv').config({ path:'../.env' });
const app = require('./app');
const connect = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mvc_api');
  app.listen(PORT, () => console.log(`API ouvindo em http://localhost:${PORT}`));
})();
