#!/usr/bin/env node
import express from "express";
import morgan from "morgan";
import { EnvVar } from "@bb301/env-var-parser";
import { resolve, join } from "path";
import { existsSync, readFileSync } from "fs";
import https from "https";

const QUICK_SERVER_PORT: number = EnvVar.asOptionalInteger("QUICK_SERVER_PORT") ?? 28080;
const QUICK_SERVER_HOSTNAME: string = EnvVar.asOptionalString("QUICK_SERVER_HOSTNAME") ?? "127.0.0.1";
const QUICK_SERVER_PUBLIC_DIR_PATH: string = EnvVar.asOptionalString("QUICK_SERVER_PUBLIC_DIR_PATH") ?? "./";
const QUICK_SERVER_HTML_INDEX_NAME: string = EnvVar.asOptionalString("QUICK_SERVER_HTML_INDEX_NAME") ?? "index.html";
const QUICK_SERVER_SSL_CERT_PATH: string | undefined = EnvVar.asOptionalString("QUICK_SERVER_SSL_CERT_PATH");
const QUICK_SERVER_SSL_KEY_PATH: string | undefined = EnvVar.asOptionalString("QUICK_SERVER_SSL_KEY_PATH");
const QUICK_SERVER_CUSTOM_RESPONSE_HEADERS: string | undefined = EnvVar.asOptionalString("QUICK_SERVER_CUSTOM_RESPONSE_HEADERS");

const customHeaders: string[][] = !QUICK_SERVER_CUSTOM_RESPONSE_HEADERS ? [] : QUICK_SERVER_CUSTOM_RESPONSE_HEADERS
    .split(",")
    .map((keyValue: string) => {
        const [key, value] = keyValue.trim().split(":");
        if (!key || !value) {
            throw new Error(`Invalid QUICK_SERVER_CUSTOM_RESPONSE_HEADERS; if present, expecting following format: 'header_1:value_1,header_2:value_2,header_3:value_3`);
        }
        return [key.trim(), value.trim()]
    });

const publicFilesDir = resolve(QUICK_SERVER_PUBLIC_DIR_PATH);
const indexFilePath = resolve(join(QUICK_SERVER_PUBLIC_DIR_PATH, QUICK_SERVER_HTML_INDEX_NAME));

if (!existsSync(publicFilesDir)) {
    console.error(new Error(`Invalid public files root directory: ${publicFilesDir}`));
    process.exit(1);
}

if (!existsSync(indexFilePath)) {
    console.error(new Error(`Invalid HTML index file path: ${indexFilePath}`));
    process.exit(1);
}

const app = express();

app.use(morgan("common"));

app.use((_req, res, next) => {
    customHeaders.forEach(([headerName, headerValue]) => {
        res.setHeader(headerName, headerValue);
    });
    next();
});

app.get(`/`, (_, res) => {
    res.sendFile(indexFilePath, {
        etag: true,
        maxAge: 0
    }, error => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
    });
});

app.use(express.static(publicFilesDir, {
    etag: true,
    maxAge: 0
}));

if (QUICK_SERVER_SSL_CERT_PATH && QUICK_SERVER_SSL_KEY_PATH) {
    const sslKey = readFileSync(resolve(QUICK_SERVER_SSL_KEY_PATH));
    const sslCert = readFileSync(resolve(QUICK_SERVER_SSL_CERT_PATH));
    https.createServer({
        key: sslKey,
        cert: sslCert
    }, app).listen(QUICK_SERVER_PORT, QUICK_SERVER_HOSTNAME, () => {
        console.log(`Express server listening on https://${QUICK_SERVER_HOSTNAME}:${QUICK_SERVER_PORT}`);
    });
} else {
    app.listen(QUICK_SERVER_PORT, QUICK_SERVER_HOSTNAME, () => {
        console.log(`Express server listening on http://${QUICK_SERVER_HOSTNAME}:${QUICK_SERVER_PORT}`);
    });
}
