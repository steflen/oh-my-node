const pidusage = require('pidusage')
const os = require('os')

const name = 'slow-sample'
let interval = 10000
const run = async ({ samplerLog: log, config }) => {
  return new Promise(async (resolve, reject) => {
    try {
      log.info('Slow pace sample example')
      const stats = await pidusage(process.pid)
      const cores = os.cpus().length
      const cpu = stats.cpu / cores
      const dto = {
        name,
        interval,
        cpuLoad: cpu.toFixed(1),
        memoryLoad: (stats.memory / 1024 / 1024).toFixed(1),
      }
      resolve(dto)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  name,
  interval,
  run,
}
