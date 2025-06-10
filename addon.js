const { addonBuilder } = require("stremio-addon-sdk");
const catalog = require("./catalog");

const BASE_URL = "http://172.16.50.12";
const builder = new addonBuilder({
    id: "org.custom.intranetaddon",
    version: "1.0.0",
    name: "Intranet Video Addon",
    description: "Streams videos from internal network",
    types: ["movie"],
    idPrefixes: ["intranet:"]
});

// catalog interface
builder.defineCatalogHandler(async ({ type, id }) => {
    if (type !== "movie" || id !== "intranet") return { metas: [] };

    const metas = await catalog.getCatalog();
    return { metas };
});

// stream interface
builder.defineStreamHandler(({ type, id }) => {
    if (type !== "movie" || !id.startsWith("intranet:")) return { streams: [] };

    const filePath = decodeURIComponent(id.replace("intranet:", ""));
    const streamUrl = `${BASE_URL}/${filePath}`;
    
    return Promise.resolve({
        streams: [{
            title: "Play",
            url: streamUrl
        }]
    });
});

module.exports = builder.getInterface();
