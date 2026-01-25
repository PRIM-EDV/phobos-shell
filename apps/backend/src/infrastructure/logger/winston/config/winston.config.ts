import { TransformableInfo } from 'logform';

import * as Winston from 'winston';

const logFormat = Winston.format.printf((info: TransformableInfo) => {
    return `${info.timestamp} ${info.level} ${info.context}${info.message}`;
});

export const winstonConfig = {
    transports: [
        new Winston.transports.Console({
            format: Winston.format.combine(
                Winston.format(info => {
                    info.level = info.level.toUpperCase().padStart(7)
                    info.context = info.context ? `\x1b[33m[${info.context}]\x1b[39m ` : '';
                    return info;
                })(),
                Winston.format.colorize({all: false, level: true, message: true}),
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                logFormat
            )
        }),
        new Winston.transports.File({
            filename: 'logs/error.log', level: 'error',
            format: Winston.format.combine(
                Winston.format(info => {
                    info.level = info.level.toUpperCase().padStart(7)
                    return info;
                })(),
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                logFormat
            )
        }),
        new Winston.transports.File({
            filename: 'logs/log.log', level: 'debug',
            format: Winston.format.combine(
                Winston.format(info => {
                    info.level = info.level.toUpperCase().padStart(7)
                    return info;
                })(),
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                logFormat
            )
        }),
    ],
}