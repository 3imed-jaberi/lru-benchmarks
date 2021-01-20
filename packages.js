// packages list
const packages = {
  'tiny-lru': { url: 'https://npmjs.com/package/tiny-lru' },
  'hashlru': { url: 'https://npmjs.com/package/hashlru' },
  'mnemonist-object': { url: 'https://www.npmjs.com/package/mnemonist' },
  'lru-cache': { url: 'https://npmjs.com/package/lru-cache' },
  'js-lru': { url: 'https://www.npmjs.com/package/js-lru' },
  // 'quick-lru': { url: 'https://npmjs.com/package/quick-lru' },
  'ylru': { url: 'https://npmjs.com/package/ylru' }
}

// packages name list.
const caches = Object.keys(packages)

// export
export default { packages, caches }
