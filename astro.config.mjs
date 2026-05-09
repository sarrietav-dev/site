// @ts-check
import { defineConfig } from 'astro/config';

// Flexoki theme for Shiki syntax highlighting
const flexokiTheme = {
  name: 'flexoki',
  type: 'dark',
  colors: {
    'activityBar.background': '#100F0F',
    'editor.background': '#100F0F',
    'editor.foreground': '#CECDC3',
    'editor.lineNumberColor': '#575653',
  },
  tokenColors: [
    {
      scope: ['comment'],
      settings: { foreground: '#B7B5AC' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#3AA99F' },
    },
    {
      scope: ['number', 'constant.numeric'],
      settings: { foreground: '#8B7EC8' },
    },
    {
      scope: ['constant'],
      settings: { foreground: '#D0A215' },
    },
    {
      scope: ['variable'],
      settings: { foreground: '#4385BE' },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: '#CECDC3' },
    },
    {
      scope: ['keyword'],
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
      scope: ['entity.name.class'],
      settings: { foreground: '#DA702C' },
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
      theme: flexokiTheme,
      langs: [],
      wrap: true,
    },
  },
});
