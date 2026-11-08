import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const compiled = { exports: {} }
const source = ts.transpileModule(fs.readFileSync('src/lib/blog-content.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
vm.runInNewContext(source, { module: compiled, exports: compiled.exports })
const { splitBlogSections } = compiled.exports

test('keeps a list with its introduction and an image with its caption', () => {
  const section = '<h2>Questions</h2><p>Before hiring:</p><ul><li>When?</li></ul><p><img src="a.webp"></p><p><em>Caption</em></p>'
  const chunks = splitBlogSections(`<p>Intro</p>${section}<h2>Next</h2><p>More</p>`)
  assert.equal(chunks[1], section)
  assert.equal(chunks.join(''), `<p>Intro</p>${section}<h2>Next</h2><p>More</p>`)
})

test('does not split nested headings, quoted attributes, comments or script strings', () => {
  const nested = '<section data-note="a > b"><h2>Nested</h2><p>Body</p></section><!-- <h2>Hidden</h2> --><script>const text = "<h2>Text</h2>";</script>'
  const html = `${nested}<H2 id="next">Next</H2><p>Text</p>`
  const chunks = splitBlogSections(html)
  assert.equal(chunks.length, 2)
  assert.equal(chunks[0], nested)
  assert.equal(chunks.join(''), html)
})

test('preserves complete tables and blockquotes', () => {
  const section = '<h2>Session</h2><table><tbody><tr><td><p>Value</p></td></tr></tbody></table><blockquote><p>Quote</p></blockquote>'
  const chunks = splitBlogSections(`${section}<h2>Next</h2>`)
  assert.equal(chunks[0], section)
})

test('leaves content without section headings intact, including empty content', () => {
  for (const html of ['', '<p>One</p><p>Two</p>', '<p>&lt;h2&gt; is escaped</p>']) {
    const chunks = splitBlogSections(html)
    assert.equal(chunks.length, 1)
    assert.equal(chunks[0], html)
  }
})
