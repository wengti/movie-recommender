
const form = document.getElementById('form')
form.addEventListener('submit', handleNextPerson)

const q1BtnArr = document.querySelectorAll('.q1-btn')
const q2BtnArr = document.querySelectorAll('.q2-btn')

let q1Selection = 'new'
let q2Selection = 'fun'

q1BtnArr.forEach(btn => {
    btn.addEventListener('click', function (event) {
        handleSelection(event, 'group1')
    })
})

q2BtnArr.forEach(btn => {
    btn.addEventListener('click', function (event) {
        handleSelection(event, 'group2')
    })
})

let currentUserId = 0 //Placeholder, automatically increment by 1 after renderPage
let { peopleCount } = JSON.parse(localStorage.getItem('metadata'))


const saveResult = []


renderPage()

function handleSelection(event, group) {
    let btnArr = q1BtnArr

    if (group === 'group1') {
        btnArr = q1BtnArr
    } else if (group === 'group2') {
        btnArr = q2BtnArr
    }

    btnArr.forEach(btn => {
        btn.classList.remove('selected')
    })

    event.target.classList.add('selected')

    if (group === 'group1') {
        q1Selection = event.target.value
    } else if (group === 'group2') {
        q2Selection = event.target.value
    }
}

function handleNextPerson(event) {
    event.preventDefault()

    const saveResultObject = {
        userId: currentUserId,
        favMovie: document.getElementById('fav-movie').value,
        q1: q1Selection,
        q2: q2Selection,
        favFilmPerson: document.getElementById('fav-film-person').value
    }

    saveResult.push(saveResultObject)

    localStorage.setItem('saveResult', JSON.stringify(saveResult))


    renderPage()

}

function renderPage() {
    
    if (currentUserId === peopleCount) {
        window.location.href = './result.html'
    } else {
        currentUserId++
        document.getElementById('userId').textContent = `${currentUserId} / ${peopleCount}`
        window.scrollTo(0, 0)

        if(currentUserId === peopleCount){
            document.getElementById('submit-btn').textContent = 'Submit!'
        }
    }

    q1Selection = 'new'
    q1BtnArr.forEach(btn => btn.classList.remove('selected'))
    Array.from(q1BtnArr).filter(btn => btn.value === q1Selection)[0].classList.add('selected')

    q2Selection = 'fun'
    q2BtnArr.forEach(btn => btn.classList.remove('selected'))
    Array.from(q2BtnArr).filter(btn => btn.value === q2Selection)[0].classList.add('selected')

    document.querySelectorAll('textarea').forEach(elem => elem.value = '')

    
    
}