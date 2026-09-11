import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stringify } from 'yaml';
import { parseContent, createKnowledge } from '../scripts/content.mjs';

const source = fs.readFileSync(new URL('../CONTENT.md', import.meta.url), 'utf8');
const content = parseContent(source);
const markdown = site => '# Edited portfolio\n\n```yaml\n' + stringify(site, { aliasDuplicateObjects: false }) + '```\n';

test('Markdown loads all sections and the public Mira project', () => {
  assert.equal(content.projects.items.find(p => p.viz === 'voice').link, 'https://github.com/crypto-vbg/Custom-Voice-Agent');
  assert.ok(content.hero.roles.length);
  assert.ok(content.chatbot.background.find(c => c.id === 'education'));
});

test('a Markdown project edit reaches the webpage data and chatbot grounding', () => {
  const edit = structuredClone(content);
  edit.projects.items[0].title = 'Updated voice project';
  edit.projects.items[0].desc = 'Updated public project description.';
  const parsed = parseContent(markdown(edit));
  assert.equal(parsed.projects.items[0].title, 'Updated voice project');
  assert.ok(createKnowledge(parsed).some(c => c.text.includes('Updated voice project') && c.text.includes('Updated public project description.')));
  assert.ok(!createKnowledge(parsed).some(c => c.text.includes('Custom Voice Agent · Mira')));
});

test('a new category and project require only a Markdown edit', () => {
  const edit = structuredClone(content);
  edit.projects.items.push({ ...edit.projects.items[1], title: 'New project', category: 'New category' });
  assert.equal(parseContent(markdown(edit)).projects.items.at(-1).category, 'New category');
});

test('missing fields and unquoted numeric stats fail with an actionable location', () => {
  const edit = structuredClone(content);
  delete edit.projects.items[0].chips;
  assert.throws(() => parseContent(markdown(edit)), /projects.items\[0\].chips/);
  const numeric = structuredClone(content);
  numeric.hero.stats[2].value = 83;
  assert.throws(() => parseContent(markdown(numeric)), /hero.stats\[2\].value/);
});

test('duplicate YAML keys, sections and project titles are rejected', () => {
  assert.throws(() => parseContent(source.replace('name: Vijith BG', 'name: Vijith BG\nname: Duplicate')), /unique/i);
  assert.throws(() => parseContent(source + '\n```yaml\nname: Duplicate\n```\n'), /Duplicate section/);
  const edit = structuredClone(content);
  edit.projects.items.push(edit.projects.items[1]);
  assert.throws(() => parseContent(markdown(edit)), /duplicate title/);
});

test('unsafe links, invalid navigation and unsupported visual types are rejected', () => {
  const edit = structuredClone(content);
  edit.projects.items[0].link = 'javascript:alert(1)';
  assert.throws(() => parseContent(markdown(edit)), /must be an http/);
  edit.projects.items[0].link = content.projects.items[0].link;
  edit.nav[0].href = '#missing';
  assert.throws(() => parseContent(markdown(edit)), /existing section/);
  edit.nav = content.nav;
  edit.projects.items[0].viz = 'unsupported';
  assert.throws(() => parseContent(markdown(edit)), /supported visual/);
});

test('multiple featured cards and misspelled section names fail before deployment', () => {
  const edit = structuredClone(content);
  edit.projects.items[1].featured = true;
  assert.throws(() => parseContent(markdown(edit)), /Only one project/);
  assert.throws(() => parseContent(source + '\n```yaml\nprojets: {}\n```\n'), /Unknown section/);
});

test('block paragraphs preserve Markdown and optional links can be omitted', () => {
  const edit = structuredClone(content);
  edit.hero.description = 'First **bold** paragraph.\n\nSecond paragraph.';
  delete edit.projects.items[0].link;
  delete edit.projects.items[0].linkLabel;
  edit.chatbot.background = [];
  const parsed = parseContent(markdown(edit));
  assert.equal(parsed.hero.description, edit.hero.description);
  assert.equal(parsed.projects.items[0].link, undefined);
  assert.ok(createKnowledge(parsed).length);
});
