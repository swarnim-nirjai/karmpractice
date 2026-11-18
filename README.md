# KARM Practice

The website of **KARM Practice** (Knowledge and Research Mobilisation) by Meenakshi Bharti.

The whole site is drawn as one continuous hand-drawn line. On wide screens the pages sit side by side and the site moves sideways; on phones and portrait screens the same pages read downwards. As the reader moves, the line draws each page’s original illustration, and it stays connected going forwards and backwards.

## Running it

Needs [Node.js](https://nodejs.org) 20.19 or later.

```sh
npm install
npm run dev       # development server
npm run build     # production build, in dist/
npm run preview   # serve the production build locally
```

The build in `dist/` is a static site that can be hosted anywhere.

## How it is organised

```
src/
├── main.jsx, App.jsx   entry point and page shell
├── site.js             the pages in order, and the contact email
├── sections/           the six pages: Home, About, Why mobilisation, Practice, Book, Engage
├── components/         top bar, page sequence, buttons, forms, privacy notice, drawings
├── engine/             the site’s behaviour, in plain JavaScript (no React)
│   ├── index.js        start-up, the pen following the reader, resizing
│   ├── mode.js         sideways or downwards layout
│   ├── fit.js          scales a crowded block so no page needs scrolling up and down
│   ├── scroll.js       mouse wheel, keyboard and in-page links
│   ├── reveal.js       text and marks appearing as they come into view
│   └── line/           the one line: drawing data, shapes, connectors, building and drawing
├── styles/             fonts, design tokens, text styles and the page layout
└── assets/             fonts and the portrait
```

React renders the content. The engine reads it: every place the line draws is marked with `data-art` (an original drawing, the arch over the portrait, the infinity, the points under the steps…), and the engine joins these into one line, in page order.

Design: Palette A (Midnight `#14213D`, Ivory `#F7F3EA`, Burgundy `#7A1F3D`, Marigold `#F2A541`); headings in Montserrat Bold, sub-headings in Calistoga, text in Montserrat, and Caveat for the handwritten notes on the line.

## Still to connect

The two forms, *Share your research journey* and *Sign-up*, are not yet connected to a form or email service. They check their fields and show a “not connected yet” message. The place to connect them is `useSubmit` in `src/components/Forms.jsx`.
