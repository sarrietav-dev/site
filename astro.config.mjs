// @ts-check
import { defineConfig } from 'astro/config';

// Flexoki Dark theme for Shiki syntax highlighting
// Based on official Flexoki specification: https://github.com/kepano/flexoki
const flexokiDarkTheme = {
  name: 'flexoki-dark',
  type: 'dark',
  colors: {
    'editor.background': '#100F0F',
    'editor.foreground': '#CECDC3',
    'editor.selectionBackground': '#CECDC333',
    'editor.lineHighlightBackground': '#1C1B1A',
    'editorLineNumber.foreground': '#403E3C',
    'editorLineNumber.activeForeground': '#CECDC3',
    'editorGutter.addedBackground': '#879A39',
    'editorGutter.modifiedBackground': '#3AA99F',
    'editorGutter.deletedBackground': '#D14D41',
  },
  tokenColors: [
    {
      scope: ['comment', 'comment.line', 'comment.block'],
      settings: { foreground: '#878580' },
    },
    {
      scope: ['string', 'string.quoted', 'string.quoted.single', 'string.quoted.double'],
      settings: { foreground: '#3AA99F' },
    },
    {
      scope: ['constant.numeric', 'constant.character.numeric'],
      settings: { foreground: '#8B7EC8' },
    },
    {
      scope: ['constant', 'constant.language'],
      settings: { foreground: '#D0A215' },
    },
    {
      scope: ['variable', 'variable.other'],
      settings: { foreground: '#CECDC3' },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: '#CECDC3' },
    },
    {
      scope: ['variable.other.property'],
      settings: { foreground: '#4385BE' },
    },
    {
      scope: ['keyword', 'keyword.control'],
      settings: { foreground: '#879A39' },
    },
    {
      scope: ['storage', 'storage.type'],
      settings: { foreground: '#879A39' },
    },
    {
      scope: ['entity.name.function'],
      settings: { foreground: '#DA702C' },
    },
    {
      scope: ['entity.name.class', 'entity.name.type'],
      settings: { foreground: '#D0A215' },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: '#DA702C' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#DA702C' },
    },
    {
      scope: ['invalid'],
      settings: { foreground: '#D14D41' },
    },
    {
      scope: ['punctuation', 'punctuation.definition'],
      settings: { foreground: '#878580' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  site: 'https://sarrietav.dev',
  markdown: {
    shikiConfig: {
      theme: flexokiDarkTheme,
      langs: [],
      wrap: true,
    },
  },
});
