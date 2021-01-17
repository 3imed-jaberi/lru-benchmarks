// packages list 
const packages = {
  'tiny-lru': { url: 'https://npmjs.com/package/tiny-lru' },
  'hashlru': { url: 'https://npmjs.com/package/hashlru' },
}

// packages name list.
const caches = Object.keys(packages)

// export
module.exports =  { packages, caches }
