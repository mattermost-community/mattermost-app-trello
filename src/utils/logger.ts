import { createLogger, format, transports } from 'winston';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const customFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        return JSON.stringify({
            level: info.level,
            message: info.message,
            request_path: info.requestPath,
            site_url: info.siteUrl,
            status: info.status,
            timestamp: info.timestamp,
        });
    })
);

export const Logger = createLogger({
    levels: logLevels,
    format: customFormat,
    transports: [new transports.Console()],
});