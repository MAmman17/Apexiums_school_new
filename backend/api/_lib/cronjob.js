const cron = require('node-cron');
const { sendWhatsAppMessage } = require('../whatsappmessage/messagehandler');
const { getDb } = require("./db.js"); // Assuming it returns the mysql connection/pool
const WHATSAPP_BIRTHDAY_LOG_KEY = 'student_birthday_whatsapp_log';

const logger = typeof global.logger !== 'undefined' ? global.logger : console;

function parseDobMonthDay(dob) {
    const raw = String(dob || '').trim();
    if (!raw) return null;

    // ISO Format: YYYY-MM-DD
    const iso = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (iso) return { month: Number(iso[2]), day: Number(iso[3]) };

    // DMY Format: DD-MM-YYYY
    const dmy = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (dmy) return { month: Number(dmy[2]), day: Number(dmy[1]) };

    const parsed = new Date(raw); 
    if (!Number.isNaN(parsed.getTime())) {
        return { month: parsed.getMonth() + 1, day: parsed.getDate() };
    }

    return null;
}

function isBirthdayToday(student, date = new Date()) {
    const birthday = parseDobMonthDay(student?.dob);
    return Boolean(birthday && birthday.month === date.getMonth() + 1 && birthday.day === date.getDate());
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

// Helper to execute MySQL queries using async/await
function queryAsync(db, sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function sendBirthdayWhatsAppMessages(db, options = {}) {
    const dateKey = todayKey(); 
    const force = options.force === true;
    const result = { attempted: 0, sent: 0, skipped: 0, failed: [] };

    // 1. Fetch Logs from AppSettings Table
    let log = {};
    try {
        const logRows = await queryAsync(
            db, 
            "SELECT settingValue FROM AppSettings WHERE settingKey = ? LIMIT 1", 
            [WHATSAPP_BIRTHDAY_LOG_KEY]
        );
        if (logRows.length > 0 && logRows[0].settingValue) {
            log = JSON.parse(logRows[0].settingValue);
        }
    } catch (err) {
        logger.error("Error fetching logs from MySQL:", err.message);
    }

    const sentToday = new Set(force ? [] : (log[dateKey] || []));

    // 2. Fetch All Students from MySQL
    // Note: Change 'students' to your exact table name if it's different
    const students = await queryAsync(db, "SELECT id, fullName, dob, parentPhone, phone FROM students", []);

    for (const student of students) {
        if (!isBirthdayToday(student)) continue;
        
        const targetPhone = student.parentPhone || student.phone;
        if (!targetPhone) {
            result.skipped += 1;
            continue;
        }
        
        if (sentToday.has(student.id)) {
            result.skipped += 1;
            continue;
        }

        result.attempted += 1;
        
        const response = await sendWhatsAppMessage(
            student,
            `Happy Birthday ${student.fullName || 'Student'}! Best wishes from Apexiums School.`
        );

        if (response && response.success) {
            result.sent += 1;
            sentToday.add(student.id);
        } else {
            result.failed.push({
                studentId: student.id,
                studentName: student.fullName,
                message: response?.error || 'WhatsApp message failed.'
            });
        }
    }

    if (AppSetting && (result.sent > 0 || force)) {
    log[dateKey] = Array.from(sentToday);
    
    await AppSetting.upsert({
        settingKey: WHATSAPP_BIRTHDAY_LOG_KEY, 
        settingValue: JSON.stringify(Object.fromEntries(Object.entries(log).slice(-30)))
    });
}

    return result;
}

function startWhatsAppBirthdayScheduler() {
    return cron.schedule('0 23 * * *', async () => {
        try {
            const db = await getDb(); // Ensure this returns the mysql connection object
            const result = await sendBirthdayWhatsAppMessages(db);
            
            logger.log(`WhatsApp birthday messages: sent ${result.sent}, failed ${result.failed.length}, skipped ${result.skipped}`);
        } catch (error) {
            logger.error('WhatsApp birthday scheduler failed:', error.message || error);
        }
    }, {
        timezone: 'Asia/Karachi'
    });
}

module.exports = {
    sendBirthdayWhatsAppMessages,
    startWhatsAppBirthdayScheduler
};
