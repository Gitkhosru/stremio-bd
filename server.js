const express = require("express");
const cors = require("cors");
const app = express();
const addonInterface = require("./addon");

app.use(cors());

app.get("/manifest.json", (req, res) => {
    res.json(addonInterface.manifest);
});

app.get("/catalog/:type/:id/:extra?.json", async (req, res) => {
    const args = {
        type: req.params.type,
        id: req.params.id
    };
    const out = await addonInterface.get("catalog")(args);
    res.json(out);
});

app.get("/stream/:type/:id.json", async (req, res) => {
    const args = {
        type: req.params.type,
        id: req.params.id
    };
    const out = await addonInterface.get("stream")(args);
    res.json(out);
});

app.listen(7000, () => {
    console.log("📺 Intranet addon running on http://localhost:7000/manifest.json");
});
