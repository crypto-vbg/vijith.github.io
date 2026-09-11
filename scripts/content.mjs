import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseDocument } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
export const contentPath = path.join(root, 'CONTENT.md');
const fail = message => { throw new Error(`CONTENT.md: ${message}`); };
const fields = (value, location, names) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${location} must be an object.`);
  for (const name of names.split(' ').filter(Boolean)) {
    if (typeof value[name] !== 'string' || !value[name].trim()) fail(`${location}.${name} must be non-empty text.`);
  }
};
const list = (value, location, check) => {
  if (!Array.isArray(value) || !value.length) fail(`${location} must be a non-empty list.`);
  value.forEach((item, i) => check(item, `${location}[${i}]`));
};
const strings = (value, location) => list(value, location, (item, at) => {
  if (typeof item !== 'string' || !item.trim()) fail(`${at} must be non-empty text. Quote numbers such as "83".`);
});
const unique = (items, key, at) => {
  if (new Set(items.map(item => item[key])).size !== items.length) fail(`${at} contains duplicate ${key} values.`);
};
function checkUrls(value, at = 'site') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (['href','ctaHref','link','src','poster','siteUrl','linkedin','github','paper'].includes(key)) {
      if (typeof child !== 'string' || !/^(https?:\/\/[^\s]+|\/[\w/.-]+|#[a-z][\w-]*)$/i.test(child)) fail(`${at}.${key} must be an http(s) URL, /media/path or #section.`);
    } else checkUrls(child, `${at}.${key}`);
  }
}

export function parseContent(markdown) {
  const blocks = [...markdown.matchAll(/^```yaml\s*\r?\n([\s\S]*?)^```\s*$/gm)];
  if (!blocks.length) fail('No YAML content blocks found. Keep the ```yaml fences.');
  const site = {};
  for (const block of blocks) {
    const doc = parseDocument(block[1], { uniqueKeys: true });
    if (doc.errors.length) fail(doc.errors[0].message);
    const data = doc.toJS({ maxAliasCount: 0 });
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail('Each YAML block must contain named fields.');
    for (const [key, value] of Object.entries(data)) {
      if (!['name','navLogo','metaTitle','metaDescription','siteUrl','location','links','nav','hero','about','experience','projects','skills','journey','contact','footer','chatbot'].includes(key)) fail(`Unknown section "${key}". Check its spelling.`);
      if (Object.hasOwn(site, key)) fail(`Duplicate section "${key}".`);
      site[key] = value;
    }
  }
  fields(site, 'site', 'name navLogo metaTitle metaDescription siteUrl location');
  if (!/^https?:\/\//.test(site.siteUrl)) fail('siteUrl must be a full http(s) URL.');
  fields(site.links, 'links', 'linkedin github paper');
  list(site.nav, 'nav', (v, at) => {
    fields(v, at, 'label href');
    if (!['#about','#experience','#projects','#skills','#journey','#contact'].includes(v.href)) fail(`${at}.href must refer to an existing section.`);
  });
  unique(site.nav, 'href', 'nav');
  fields(site.hero, 'hero', 'badge titleFirst titleAccent description ctaSecondary ctaHref chatLabel scrollLabel');
  fields(site.hero.film, 'hero.film', 'src poster');
  if (!['#top','#about','#experience','#projects','#skills','#journey','#contact'].includes(site.hero.ctaHref)) fail('hero.ctaHref must refer to an existing section.');
  strings(site.hero.roles, 'hero.roles');
  list(site.hero.stats, 'hero.stats', (v, at) => fields(v, at, 'value label'));
  fields(site.about, 'about', 'kicker title');
  strings(site.about.paragraphs, 'about.paragraphs');
  if (site.about.photo) fields(site.about.photo, 'about.photo', 'src alt caption');
  list(site.about.cards, 'about.cards', (v, at) => fields(v, at, 'icon title desc'));
  fields(site.experience, 'experience', 'kicker title subtitle org period detailsLabel closeLabel');
  list(site.experience.items, 'experience.items', (v, at) => {
    fields(v, at, 'tag title impact summary desc'); strings(v.chips, `${at}.chips`);
  });
  fields(site.projects, 'projects', 'kicker title subtitle allLabel featuredLabel');
  list(site.projects.items, 'projects.items', (v, at) => {
    fields(v, at, 'tag title category desc viz'); strings(v.chips, `${at}.chips`);
    if (!['voice','constellation','loss','chat','commits'].includes(v.viz)) fail(`${at}.viz is not a supported visual.`);
    if (v.link) fields(v, at, 'linkLabel');
    if (v.featured !== undefined && typeof v.featured !== 'boolean') fail(`${at}.featured must be true or false.`);
    if (v.highlights) strings(v.highlights, `${at}.highlights`);
    if (v.flow) strings(v.flow, `${at}.flow`);
    if (v.category === site.projects.allLabel) fail(`${at}.category cannot use the all-work filter label.`);
  });
  if (site.projects.items.filter(p => p.featured).length > 1) fail('Only one project can have featured: true.');
  unique(site.projects.items, 'title', 'projects.items');
  unique(site.experience.items, 'title', 'experience.items');
  fields(site.skills, 'skills', 'kicker title subtitle');
  list(site.skills.groups, 'skills.groups', (v, at) => { fields(v, at, 'title hint'); strings(v.chips, `${at}.chips`); });
  fields(site.journey, 'journey', 'kicker titleLine1 titleLine2 text');
  list(site.journey.interests, 'journey.interests', (v, at) => fields(v, at, 'emoji title desc'));
  fields(site.contact, 'contact', 'kicker title subtitle');
  list(site.contact.buttons, 'contact.buttons', (v, at) => {
    fields(v, at, 'label href');
    if (typeof v.primary !== 'boolean') fail(`${at}.primary must be true or false.`);
  });
  fields(site.footer, 'footer', 'left right');
  fields(site.chatbot, 'chatbot', 'title welcome placeholder footnote capacityMessage');
  strings(site.chatbot.suggestedQuestions, 'chatbot.suggestedQuestions');
  strings(site.chatbot.queueMessages, 'chatbot.queueMessages');
  if (!Array.isArray(site.chatbot.background)) fail('chatbot.background must be a list (or [] if empty).');
  site.chatbot.background.forEach((v, i) => fields(v, `chatbot.background[${i}]`, 'id section text'));
  checkUrls(site);
  return site;
}

export function createKnowledge(site) {
  const chunk = (section, id, text) => ({ section, id, text });
  return [
    chunk('About', 'identity', `${site.name}. ${site.hero.roles.join(', ')}. ${site.location}. ${site.hero.badge}. ${site.hero.description}`),
    chunk('About', 'background', site.about.paragraphs.join('\n')),
    chunk('About', 'approach', site.about.cards.map(c => `${c.title}: ${c.desc}`).join('\n')),
    chunk('Experience', 'organization', `${site.experience.org}. ${site.experience.period}. ${site.experience.subtitle}`),
    ...site.experience.items.map((p, i) => chunk('Experience', `work-${i}`, `${p.title} — ${p.tag}. ${p.impact}. ${p.desc} Technologies: ${p.chips.join(', ')}.`)),
    ...site.projects.items.map((p, i) => chunk('Personal projects', `project-${i}`, `${p.title} — ${p.tag}. ${p.desc} Technologies: ${p.chips.join(', ')}. ${p.link || ''}`)),
    ...site.skills.groups.map((g, i) => chunk('Skills', `skills-${i}`, `${g.title}: ${g.hint}. ${g.chips.join(', ')}.`)),
    chunk('Personal', 'interests', `${site.journey.text} ${site.journey.interests.map(i => `${i.title}: ${i.desc}`).join(' ')}`),
    chunk('Contact', 'contact', `${site.name} is based in ${site.location}. Contact links: ${site.contact.buttons.map(b => `${b.label}: ${b.href}`).join(', ')}. ${site.contact.subtitle}. Email and phone are private.`),
    ...site.chatbot.background,
  ];
}

export function generateContent() {
  const site = parseContent(fs.readFileSync(contentPath, 'utf8'));
  const { background, ...chatbot } = site.chatbot;
  const outputs = [
    ['src/content.generated.json', JSON.stringify({ ...site, chatbot }, null, 2) + '\n'],
    ['api/_lib/content.generated.js', '// Generated from CONTENT.md. Do not edit.\nexport const CHUNKS = ' + JSON.stringify(createKnowledge(site), null, 2) + ';\n'],
  ];
  for (const [name, text] of outputs) {
    const destination = path.join(root, name);
    if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== text) fs.writeFileSync(destination, text);
  }
  return site;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateContent();
  console.log('CONTENT.md validated. Webpage and chatbot content generated.');
}
