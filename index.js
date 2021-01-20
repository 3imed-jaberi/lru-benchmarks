/*!
 * LRUs Benchmarks
 *
 * Copyright(c) 2020 Imed Jaberi
 * MIT Licensed
 */

'use strict'

// Module dependencies.
import 'make-promises-safe'
import Worker from 'tiny-worker'
import ora from 'ora'
import fs from 'fs'
import path from 'path'

// init vars.
import packages from './packages.js'
const pkgsLength = packages.caches.length
const promises = []

// load a spinner.
const spinner = ora(`Starting benchmark of ${pkgsLength} caches`).start()

// store all worker promises inside an queue.
packages
  .caches
  .forEach((cache, index) => {
    // worker promise.
    const promise = new Promise(async (resolve, reject) => {
      try {
        // recursion loop inside the queue.
        await (index === 0 ? Promise.resolve() : promises[index - 1])

        // create an instance of worker.
        const worker = new Worker('worker.js')

        // message handler.
        worker.onmessage = ({ data }) => {
          resolve(data)
          worker.terminate()
        }

        // error handler.
        worker.onerror = (err) => {
          reject(err)
          worker.terminate()
        }

        // update the spinner test.
        spinner.text = `Benchmarking ${index + 1} of ${pkgsLength} caches [${cache}]`

        // broadcasts a message.
        worker.postMessage(cache)

        //
        return
      } catch (error) {
        reject(error)
      }
    })

    promises.push(promise)
  })

// run all workers promises.
process.nextTick(async () => {
  try {
    // bench result.
    const result = await Promise.all(promises)

    // update the spinner with success logo.
    setTimeout(() => { spinner.succeed() }, 1500)

    // store the result inside un json file.
    fs.writeFileSync(
      path.resolve(process.cwd(), 'benchmarks-results.json'),
      JSON.stringify({
        note: 'higher is better',
        benchmarks: result.map(item => JSON.parse(item))
      }, null, 2)
    )
  } catch (error) {
    // update the spinner with failed logo.
    setTimeout(() => { spinner.fail() }, 1500)

    // log the error then exist.
    console.error(error.stack || error.message || error)
    process.exit(1)
  }

  // stop the spinner.
  setTimeout(() => { spinner.stop() }, 1500)
})
