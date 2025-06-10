const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const BASE_URL = "http://172.16.50.12";
const SUPPORTED_FORMATS = [".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"];

// Helper: Recursively scan indexed files
async function listFilesRecursively(url, currentPath = "") {
    const fullUrl = `${url}${currentPath}`;
    let results = [];

    try {
        const res = await axios.get(fullUrl);
        const $ = cheerio.load(res.data);

        const links = $("a").get();

        for (const link of links) {
            const name = $(link).attr("href");

            if (name === "../") continue;

            const newPath = path.posix.join(currentPath, name);
            if (name.endsWith("/")) {
                const subResults = await listFilesRecursively(url, `${newPath}/`);
                results = results.concat(subResults);
            } else if (SUPPORTED_FORMATS.includes(path.extname(name).toLowerCase())) {
                results.push(newPath);
            }
        }
    } catch (err) {
        console.error(`Failed to scan ${fullUrl}:`, err.message);
    }

    return results;
}

// Formats catalog item
function formatToMeta(filePath) {
    const name = path.basename(filePath);
    const id = `intranet:${encodeURIComponent(filePath)}`;
    return {
        id,
        name,
        type: "movie",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/512px-No_image_available.svg.png",
        description: decodeURIComponent(filePath)
    };
}

module.exports = {
    getCatalog: async () => {
        const files = await listFilesRecursively(BASE_URL, "");
        return files.map(formatToMeta);
    }
};
