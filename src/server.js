import dotenv from 'dotenv';
import app from './app.js';
import connect from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mvc_api');
    app.listen(PORT, () => console.log(`API ouvindo em http://localhost:${PORT}`));
  } catch (error) {
    console.error('Erro ao conectar no banco ou iniciar o servidor', error);
    process.exit(1);
  }
})();
