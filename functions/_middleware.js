// Cloudflare Pages middleware: localise prices by the visitor's country.
// Elements carry data-usd / data-cad text; Canada gets CAD, everyone else USD.
// Client-side JS in index.html does the same from the timezone as a fallback.
const PRICES = {
  CA: { cur: 'CAD', big: '$44.99', note: 'CAD · one-time · no subscription', short: '$44.99 CAD', modal: '$44.99 CAD' },
  US: { cur: 'USD', big: '$32.99', note: 'USD · one-time · no subscription', short: '$32.99', modal: '$32.99 USD' },
};

class PriceRewriter {
  constructor(p) { this.p = p; }
  element(el) {
    const kind = el.getAttribute('data-price');
    if (kind && this.p[kind] !== undefined) el.setInnerContent(this.p[kind]);
  }
}
class HtmlTag {
  constructor(cc) { this.cc = cc; }
  element(el) { el.setAttribute('data-country', this.cc); }
}

export async function onRequest({ request, next }) {
  const res = await next();
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return res;
  const country = (request.cf && request.cf.country) || 'US';
  const p = PRICES[country === 'CA' ? 'CA' : 'US'];
  const out = new HTMLRewriter()
    .on('[data-price]', new PriceRewriter(p))
    .on('html', new HtmlTag(country))
    .transform(res);
  out.headers.set('Vary', 'CF-IPCountry');
  return out;
}
