const a = require('express'), b = require('body-parser'), c = require('shortid'), d = require('valid-url'), e = a(), f = 3000, g = {};
e.use(b.json());
const h = x => d.isUri(x);

e.post('/shorten', (i, j) => {
  const { longUrl: k, customAlias: l } = i.body;
  if (!k || !h(k)) return j.status(400).json({ error: 'invalid url' });
  const m = l || c.generate();
  if (l && g[l]) return j.status(409).json({ error: 'alias already in use' });
  g[m] = { longUrl: k, clicks: 0, createdAt: new Date().toISOString() };
  j.json({ shortUrl: `http://localhost:${f}/${m}` });
});

e.get('/:n', (o, p) => {
  const { n: q } = o.params, r = g[q];
  if (!r) return p.status(404).json({ error: 'Shortened URL not found' });
  r.clicks += 1;
  p.redirect(r.longUrl);
});

e.get('/:n/stats', (o, p) => {
  const { n: q } = o.params, r = g[q];
  if (!r) return p.status(404).json({ error: 'Shortened URL not found' });
  p.json({ longUrl: r.longUrl, clicks: r.clicks, createdAt: r.createdAt });
});

e.get('/admin/list', (o, p) => p.json(g));

e.delete('/:n', (o, p) => {
  const { n: q } = o.params;
  if (!g[q]) return p.status(404).json({ error: 'Shortened URL not found' });
  delete g[q];
  p.json({ message: 'Shortened URL successfully deleted' });
});

e.listen(f, () => console.log(`URL shortener running at http://localhost:${f}`)); 
