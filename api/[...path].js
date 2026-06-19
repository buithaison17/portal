export default async function handler(req, res) {
    try {
        // ===== 1. REWRITE PATH =====
        const path = req.query.path?.join("/") || "";
        const targetUrl = `https://apiportal.rikkei.edu.vn/${path}`;

        // ===== 2. HEADERS =====
        const incomingHeaders = { ...req.headers };

        const headers = {
            ...incomingHeaders,

            // fake browser giống Vite proxy
            origin: "https://portal.rikkei.edu.vn",
            referer: "https://portal.rikkei.edu.vn/",

            host: "apiportal.rikkei.edu.vn",
        };

        // remove headers gây lỗi
        delete headers["content-length"];
        delete headers["host"];

        // ===== 3. COOKIE + AUTH =====
        if (incomingHeaders.cookie) {
            headers.cookie = incomingHeaders.cookie;
        }

        if (incomingHeaders.authorization) {
            headers.authorization = incomingHeaders.authorization;
        }

        // ===== 4. BODY =====
        const body =
            req.method !== "GET" && req.method !== "HEAD"
                ? JSON.stringify(req.body || {})
                : undefined;

        // ===== 5. FETCH BACKEND =====
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        const data = await response.text();

        // ===== 6. RESPONSE HEADERS =====
        res.status(response.status);

        const contentType = response.headers.get("content-type");
        if (contentType) {
            res.setHeader("Content-Type", contentType);
        }

        res.send(data);
    } catch (err) {
        res.status(500).json({
            error: "Proxy failed",
            message: err.message,
        });
    }
}
