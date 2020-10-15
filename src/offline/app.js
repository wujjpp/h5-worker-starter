if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
}

let current = 1

function prev() {
  if (current > 1) {
    current--
    document.getElementById('img1').src = `./images/${current}.jpg`
    setStatus()
  }
}

function next() {
  if (current < 5) {
    current++
    document.getElementById('img1').src = `./images/${current}.jpg`
    setStatus()
  }
}

function setStatus() {
  let btnPrev = document.getElementById('btnPrev')
  let btnNext = document.getElementById('btnNext')

  if (current === 1) {
    btnPrev.setAttribute('disabled', true)
  } else {
    btnPrev.removeAttribute('disabled')
  }

  if (current === 5) {
    btnNext.setAttribute('disabled', true)
  } else {
    btnNext.removeAttribute('disabled')
  }
  document.getElementById('indicator').innerText = `${current} / 5`
}