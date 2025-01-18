const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const validUrl = require('valid-url');
// something here i forgot to add my fault
const app = express();
const PORT = 3000;

const urlDatabase = {}; //brace fixing 

app.use(bodyParser.json());

const isValidUrl = (url) => validUrl.isUri(url);
// paste header
app.post('/shorten', (req, res) => {
    const { longUrl, customAlias } = req.body;

    if (!longUrl || !isValidUrl(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided' });
    }

    const shortId = customAlias || shortid.generate();

    if (customAlias && urlDatabase[customAlias]) {
        return res.status(409).json({ error: 'This custom alias is already in use' });
    }

    urlDatabase[shortId] = {
        longUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
    };
//add own site
    res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
});

app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;

    const entry = urlDatabase[shortId];
    if (!entry) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }

    entry.clicks += 1;
    res.redirect(entry.longUrl);
});
// deleted all help 
app.get('/:shortId/stats', (req, res) => {
    const { shortId } = req.params;

    const entry = urlDatabase[shortId];
    if (!entry) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }
// enter in pbase
    res.json({
        longUrl: entry.longUrl,
        clicks: entry.clicks,
        createdAt: entry.createdAt,
    });
});

app.get('/admin/list', (req, res) => {
    res.json(urlDatabase);
});
//dm .d.m.x. on dc for help whys this not working fixing rn
app.delete('/:shortId', (req, res) => {
    const { shortId } = req.params;

    if (!urlDatabase[shortId]) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }

    delete urlDatabase[shortId];
    res.json({ message: 'Shortened URL successfully deleted' });
});

app.listen(PORT, () => {
    console.log(`URL shortener is up and running at http://localhost:${PORT}`);
});
