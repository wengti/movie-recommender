const form = document.getElementById('form')
form.addEventListener('submit', handleStart)

localStorage.clear()

function handleStart(event) {
    event.preventDefault()

    localStorage.setItem('metadata', JSON.stringify({
        peopleCount: Number(document.getElementById('people-count').value),
        hourCount: Number(document.getElementById('hour-count').value),
        minuteCount: Number(document.getElementById('minute-count').value)
    }))

    window.location.href = './detail.html'
}
