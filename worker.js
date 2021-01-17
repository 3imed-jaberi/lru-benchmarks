'use strict'

const median = require('median')
const Timer = require('ns-timer')

// ============== BENCHMARKS ============== //
const cachesBenchs = {
  'tiny-lru': require('tiny-lru'),
  hashlru: require('hashlru')
}

// ======================================== //

// ================ WORKER ================ //
// init vars.
const _cacheSize = 2e5 // 200000
const _evict = _cacheSize * 2 // 400000
const _times = 5
const _base = 1e6 // 1000000
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

    const get1Timer = new Timer().start();
    for (let index = 0; index < _cacheSize; index++) lru.get(_data1[index][0])
    timesStore.get1.push(get1Timer.stop().diff() / _base)

    const updateTimer = new Timer().start()
    for (let index = 0; index < _cacheSize; index++) lru.set(_data1[index][0],_data2[index][1])
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
  });

  postMessage(JSON.stringify(resultsStore))
}

// ======================================== //
