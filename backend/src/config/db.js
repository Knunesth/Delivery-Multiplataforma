const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Pool de conexões: evita queda silenciosa após inatividade (problema do Render Free Tier)
const pool = mysql.createPool({
  host:              process.env.DB_HOST,
  user:              process.env.DB_USER,
  password:          process.env.DB_PASSWORD,
  database:          process.env.DB_NAME,
  port:              process.env.DB_PORT || 3306,
  ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: true } }),

  // Pool config
  connectionLimit:   10,       // máximo de conexões simultâneas
  waitForConnections: true,    // aguarda se o pool estiver cheio
  queueLimit:        0,        // sem limite de requisições na fila

  // Mantém conexões vivas (evita timeout do TiDB/MySQL após inatividade)
  enableKeepAlive:   true,
  keepAliveInitialDelay: 10000, // ping a cada 10s nas conexões ociosas

  // Reconecta automaticamente em caso de erro de conexão
  reconnectDelay:    2000,
});

// Testa a conectividade na inicialização
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('✅ Pool de conexões MySQL/TiDB ativo!');
  connection.release(); // devolve a conexão ao pool
});

module.exports = pool.promise();

