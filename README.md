# LRUs benchmarks 📊.
---

### Benchmark the LRUs (least-recently-used) caches which are available on npm which inspired from [fastify-benchmarks][] and [bench-lru][].

I run a very simple multi-process benchmark, with 20 iterations to get a median of ops/ms:

  1. Set the LRU to fit max N=800,000 items.
  2. Add N random numbers to the cache, with keys 0-N.
  3. Then update those keys with new random numbers.
  4. Then evict those keys, by adding keys N-2N.

You can see the result on [benchmarks-results.json](./benchmarks-results.json).


#### Opinion

Based to the results and experiences I can say the better choice in heavy operations is `mnemonist/lru-cache` otherwise `hashlru` is the most stable.


#### License
---

[MIT](LICENSE) &copy;	[Imed Jaberi](https://github.com/3imed-jaberi)


<!-- ***************** -->

[bench-lru]: https://github.com/dominictarr/bench-lru
[fastify-benchmarks]: https://github.com/fastify/benchmarks

<!-- ***************** -->
