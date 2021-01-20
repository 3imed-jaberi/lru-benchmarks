'use strict'

const median = require('median')
const Timer = require('ns-timer')

// ============== BENCHMARKS ============== //
// LRUs modules.
const tinyLRU = require('tiny-lru')
const hashLRU = require('hashlru')
const MnemonistLRUCache = require('mnemonist/lru-cache')
const MnemonistLRUMap = require('mnemonist/lru-map')
const LRUCacheHyphen = require('lru-cache')
const { LRUMap: jsLRU } = require('lru_map')
// esm warn.
// const QuickLRU = (async () => await import('quick-lru'))()
const yLRU = require('ylru');

// LRUs funcs.
const cachesBenchs = {
  'tiny-lru': tinyLRU,
  'hashlru': hashLRU,
  'mnemonist-object': n => new MnemonistLRUCache(n),
  'mnemonist-map': n => new MnemonistLRUMap(n),
  'lru-cache': n => new LRUCacheHyphen(n),
  'js-lru': n => new jsLRU(n),
  //'quick-lru': n => new QuickLRU({ maxSize: n }),
  'ylru': n => new yLRU(n)
}

// ======================================== //

// ================ WORKER ================ //
// init vars.
const _cacheSize = 8e5 // 800000
const _evict = _cacheSize * 2 // 1600000
const _times = 20
const _base = 4e6 // 4000000
const _data1 = new Array(_evict)
const _data2 = new Array(_evict)

// seeder.
process.nextTick(() => {
  let counter = -1

  while (++counter < _evict) {
    _data1[counter] = [counter, Math.floor(Math.random() * 1e7)]
    _data2[counter] = [counter, Math.floor(Math.random() * 1e7)]
  }
})

// worker.
self.onmessage = function ({ data: name }) {
  // time store.
  const timesStore = {
    set: [],
    get1: [],
    update: [],
    get2: [],
    evict: []
  }

  // result store.
  const resultsStore = {
    name,
    set: 0,
    get1: 0,
    update: 0,
    get2: 0,
    evict: 0
  }

  let _currentTimes = -1

  while (++_currentTimes < _times) {
    const lru = cachesBenchs[name](_cacheSize)
    const setTimer = new Timer().start()
    for (let index = 0; index < _cacheSize; index++) lru.set(_data1[index][0], _data1[index][1])
    timesStore.set.push(setTimer.stop().diff() / _base)

    const get1Timer = new Timer().start()
    for (let index = 0; index < _cacheSize; index++) lru.get(_data1[index][0])
    timesStore.get1.push(get1Timer.stop().diff() / _base)

    const updateTimer = new Timer().start()
    for (let index = 0; index < _cacheSize; index++) lru.set(_data1[index][0], _data2[index][1])
    timesStore.update.push(updateTimer.stop().diff() / _base)

    const get2Timer = new Timer().start()
    for (let index = 0; index < _cacheSize; index++) lru.get(_data1[index][0])
    timesStore.get2.push(get2Timer.stop().diff() / _base)

    const evictTimer = new Timer().start()
    for (let index = _cacheSize; index < _evict; index++) lru.set(_data1[index][0], _data1[index][1])
    timesStore.evict.push(evictTimer.stop().diff() / _base)
  }

  ['set', 'get1', 'update', 'get2', 'evict'].forEach((method) => {
    resultsStore[method] = Number((_cacheSize / median(timesStore[method]).toFixed(2)).toFixed(0))
  })

  postMessage(JSON.stringify(resultsStore))
}

// ======================================== //
