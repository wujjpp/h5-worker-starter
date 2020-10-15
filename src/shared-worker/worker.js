/**
 * Created by Wu Jian Ping on - 2020/10/15.
 */

let count = 100
let ports = []

onconnect = function (e) {
  let port = e.ports[0]

  ports.push(port)

  port.addEventListener('message', function (e) {
    switch (e.data.event) {
      case 'inc':
        count++;
        break

      case 'dec':
        count--;
        break
    }

    for (port of ports) {
      port.postMessage({ count: count })
    }
  })

  port.start()
}