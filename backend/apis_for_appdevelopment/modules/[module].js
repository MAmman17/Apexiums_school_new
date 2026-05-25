const { createHandler, sendJson } = require('../_lib/http');
const { getDb } = require('../_lib/db');
const {
    deleteModuleData,
    getModuleDataFromBody,
    readModuleData,
    writeModuleData
} = require('../_lib/module-store');

function getModuleKey(req) {
    return req.query?.module || req.query?.moduleKey || req.query?.id || '';
}

module.exports = createHandler({
    GET: async ({ req, res, db }) => {
        const record = await readModuleData(db, getModuleKey(req));
        sendJson(res, 200, { success: true, ...record });
    },
    POST: async ({ req, res, db, body }) => {
        const record = await writeModuleData(
            db,
            getModuleKey(req),
            getModuleDataFromBody(body),
            req.headers['x-updated-by'] || ''
        );
        sendJson(res, 200, { success: true, ...record });
    },
    DELETE: async ({ req, res, db }) => {
        const record = await deleteModuleData(db, getModuleKey(req));
        sendJson(res, 200, { success: true, ...record });
    }
}, { getDb });
