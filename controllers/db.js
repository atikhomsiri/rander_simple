const { Pool } = require('pg');

const pool = new Pool({
    user: 'sql_thesaban_user',
    password: 's4q0wCqmsxZZbhLvf9EgGrUC2FvU05pl',
    host: 'dpg-cnakvida73kc73eng0v0-a.oregon-postgres.render.com',
    port: '5432',
    database: 'sql_thesaban',
    ssl: true
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};