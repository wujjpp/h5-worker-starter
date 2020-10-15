
/**
 * Created by Wu Jian Ping on - 2020/10/15.
 */

self.addEventListener('message', function (e) {
  switch (e.data.event) {
    case 'onStart':
      start(e)
      break
    case 'onStop':
      stop(e)
      break
    case 'onCount':
      count()
  }
}, false)

function start(e) {
  console.log(`[worker]: ${JSON.stringify(e.data)}`)
  self.postMessage({
    event: 'onStarted',
    payload: {
      t: new Date()
    }
  })
}

function stop(e) {
  console.log(`[worker]: ${JSON.stringify(e.data)}`)
  self.postMessage({
    event: 'onStopped',
    payload: {
      t: new Date()
    }
  })
}

let cnt = 0
function count() {
  while (true) {
    cnt++
    self.postMessage({
      event: 'onCounted',
      payload: {
        count: cnt
      }
    })
  }
}