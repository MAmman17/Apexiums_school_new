const MODULE_DATA_PREFIX = 'module_data:';

const DEFAULT_MODULE_KEYS = [
    'aboutme',
    'annual_charges',
    'assignments',
    'assignment_uploading',
    'bills',
    'certificate',
    'classes',
    'complain_box',
    'diary',
    'exam_result',
    'exam_result_history',
    'exam_schedule',
    'exams',
    'families',
    'fee_logos',
    'finance',
    'lecture_uploading',
    'notifications',
    'portal_about',
    'quiz_uploading',
    'settings',
    'student_courses',
    'student_diary',
    'student_scheduling',
    'student_timetable',
    'stuck_off',
    'teacher_assigned_classes',
    'teacher_leave_requests',
    'teacher_scheduling',
    'teacher_timetable',
    'visitor_books'
];

const moduleKeySet = new Set(DEFAULT_MODULE_KEYS);

function normalizeModuleKey(value) {
    const key = String(value || '').trim().toLowerCase();
    if (!/^[a-z0-9_-]{2,80}$/.test(key)) {
        const error = new Error('Valid module key is required.');
        error.statusCode = 400;
        throw error;
    }
    return key;
}

function getSettingKey(moduleKey) {
    return `${MODULE_DATA_PREFIX}${normalizeModuleKey(moduleKey)}`;
}

function getModuleDataFromBody(body) {
    if (body && Object.prototype.hasOwnProperty.call(body, 'data')) {
        return body.data;
    }
    return body ?? null;
}

async function readModuleData(db, moduleKey) {
    const key = normalizeModuleKey(moduleKey);
    const row = await db.models.AppSetting.findByPk(getSettingKey(key));
    if (!row?.settingValue) {
        return {
            moduleKey: key,
            data: null,
            updatedAt: null
        };
    }

    try {
        const parsed = JSON.parse(row.settingValue);
        return {
            moduleKey: key,
            data: parsed?.data ?? null,
            updatedAt: parsed?.updatedAt || row.updatedAt || null,
            updatedBy: parsed?.updatedBy || ''
        };
    } catch (_error) {
        return {
            moduleKey: key,
            data: null,
            updatedAt: row.updatedAt || null
        };
    }
}

async function writeModuleData(db, moduleKey, data, updatedBy = '') {
    const key = normalizeModuleKey(moduleKey);
    const payload = {
        moduleKey: key,
        data,
        updatedAt: new Date().toISOString(),
        updatedBy: String(updatedBy || '').trim()
    };

    await db.models.AppSetting.upsert({
        settingKey: getSettingKey(key),
        settingValue: JSON.stringify(payload)
    });

    return payload;
}

async function deleteModuleData(db, moduleKey) {
    const key = normalizeModuleKey(moduleKey);
    await db.models.AppSetting.destroy({ where: { settingKey: getSettingKey(key) } });
    return {
        moduleKey: key,
        data: null,
        updatedAt: null
    };
}

function listDefaultModules() {
    return [...moduleKeySet].sort();
}

module.exports = {
    getModuleDataFromBody,
    listDefaultModules,
    normalizeModuleKey,
    readModuleData,
    writeModuleData,
    deleteModuleData
};
