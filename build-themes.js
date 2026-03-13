import { readFileSync, writeFileSync } from 'fs';

const source = readFileSync('index.html', 'utf8');

const themes = {
  barbie: 'og-barbie.png',
  mtv: 'og-mtv.png',
};

for (const [theme, ogImage] of Object.entries(themes)) {
  const themed = source
    .replace(
      /(<meta property="og:image" content=")([^"]*)(">)/,
      `$1https://jscottchapman.com/${ogImage}$3`
    )
    .replace(
      /(<meta name="twitter:image" content=")([^"]*)(">)/,
      `$1https://jscottchapman.com/${ogImage}$3`
    );

  writeFileSync(`index-${theme}.html`, themed);
  console.log(`Generated index-${theme}.html with ${ogImage}`);
}
