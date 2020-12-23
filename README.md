# Seia-Soto/alph

The programmer-friendly API wrapper for [hitomi-dot-la](https://hitomi.la), working on Node.JS (server-only).

## Table of Contents

- [API](#API)

----

# API

The website uses raw buffers to provide the list of parts and this can reduce a lot of data.
However, you must not expect human-readable API such as RESTful or GraphQL in the website.
So, the goal of this module is to provide a programmer-friendly API.

- To install this repository as module: `yarn add Seia-Soto/alph`
- To load modules: `const alph = require('Seia-Soto/alph')`

## DPI

Some nations are blocking hitomi-dot-la as an illegal website.
This package doesn't provide any interface to bypass DPI machines.
You need to use your own HTTP proxy to bypass traffic route and crawl values correctly.
If you're on censored network, I recommend you to use DPI redirection tools like [GreenTunnel](https://github.com/SadeghHayeri/GreenTunnel).
(You know that, packet fragmentation :> )

- To bypass DPI machines, this module is providing you an option as last parameter to set `agent` of node-fetch.

```js
const alph = require('Seia-Soto/alph')
const ProxyAgent = require('https-proxy-agent')

const agent = new ProxyAgent('http://127.0.0.1:8080')

alph.someFunctionThatRequests(..., agent)
```

## functions

### getIndexVersion

Loads the version of index, using JavaScript's UTC timestamp.

```js
const result = await alph.getIndexVersion(type, agent)

/*
  typeof result === 'number'
*/
```

- Possible values of `type`: `galleriesindex`, `tagindex`, `languagesindex`, `nozomiurlindex`

### getIndexOf

Loads latest items with tags enabled.

```js
const languageIndex = await alph.getIndexOf(
  {
    key: 'language',
    value: 'korean'
  },
  agent
)

/*
  Array.isArray(languageIndex) === true
  typeof languageIndex[0] === 'number' // set of gallery ids
*/
```

- Possible values of:
  - `opts.key`: `language`, `artist`, `tag`
  - `opts.value`: `all ('language' key-only)`, `female:...`, `male:...`, ...
  - `opts.skip`: number, skip `skip * limit` items, **starting from 1**
  - `opts.limit`: number, items per page, **required to set max item count**

- Notes:
  - Implementation of `B_Search`, also-known-as plain text search is not planned due to high resource use.
    So, `opts.key` value is now **required** value, not an optional.

### buildURL

Internal function to build request URL for querying tags or artists...

```js
const url = await alph.buildURL({
  key: 'language',
  value: 'korean'
})

/*
  typeof url === 'string'
*/
```

- Possible values of:
  - `opts.key`: `language`, `artist`, `tag`
  - `opts.value`: `all ('language' key-only)`, `female:...`, `male:...`, ...

### decodeIndex

Internal function to parse `.index` files from the site.

> **Warning**
> Unsupported feature (not implemented)!

```js
const result = await alph.decodeIndex()

// NOTE: unsupported feature, yet!
```

### decodeNozomi

Internal function to parse `.nozomi` files from the site.

```js
const result = await alph.decodeNozomi(buffer)

/*
  Array.isArray(result) === true
  typeof result[0] === 'number' // set of gallery ids
*/
```

- Possible values of:
  - `buffer`: arraybuffer of nozomi index file.

### getHashOf

Internal function to create SHA256 hash for searching with plain-text.
Hitomi-dot-la is using this term to beta-search between subdomains.

```js
const result = await alph.getHashOf(text)

/*
  typeof result === 'string'
  result.length === 4
*/
```

- Possible values of:
  - `text`: Text to generate `term`, can be values accepted by Node.JS crypto module.

### getMetadata

Grab metadata of specific gallery id from hitomi-dot-la.

```js
const metadata = await alph.getMetadata(id, agent)

/*
{
 title: '...',
  artists: [Array],
  contexts: [
    { key: 'Series', values: [Array] },
    { key: 'Type', values: [Array] },
    { key: 'Language', values: [Array] },
    { key: 'Tags', values: [Array] },
    ...
  ],
  date: [DateString]
}
*/
```

- Possible values of:
  - `id`: A number of gallery id.
