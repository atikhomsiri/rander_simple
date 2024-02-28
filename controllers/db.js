const { Pool } = require('pg');

const pool = new Pool({
    user: 'thesaban_pg_user',
    password: 'wtMit6gxJaOLHwajNqfwiVtEiPGWAhMM',
    host: 'dpg-cnfnrvqcn0vc73ark6r0-a.singapore-postgres.render.com',
    port: '5432',
    database: 'thesaban_pg',
    ssl: true
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};