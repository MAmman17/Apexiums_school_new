const { createHandler, sendJson } = require('../_lib/http');
const { getDb } = require('../_lib/db');
const { listDefaultModules } = require('../_lib/module-store');

module.exports = createHandler({
    GET: async ({ res }) => {
        sendJson(res, 200, {
            success: true,
            modules: listDefaultModules()
        });
    }
}, { getDb });
