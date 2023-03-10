let courseSelector = document.getElementById('courseSelect')
let playGolfButton = document.getElementById('playGolf')
// let playersArr = Array.from(document.getElementsByClassName('playerName'))
let playerInputs = document.querySelector('.playerInputs')
let addNewPlayerButton = document.getElementById('addNewPlayer')
let scoreCard = document.getElementById('scoreCard')
let addScoreModal = document.getElementById('addScoreModal')
let IdCount = 0

class Player {
    constructor(name, id = getNextID(), scores = []) {
        this.name = name,
        this.id = id,
        this.scores = scores
    }
}
class Game {
    constructor(course = {}, players = []) {
        this.course = course,
        this.players = players
    }
}

function getNextID () {
    IdCount++
    return IdCount
}

function setInitialLocalStorage () {
    window.localStorage.setItem('golfScore', JSON.stringify([]))
}

function checkForGolfScore () {
    return localStorage.getItem('golfScore')
}

function getGolfScore () {
    return JSON.parse(localStorage.getItem('golfScore'))
}

function createTableData(parentEle, value) {
    let tableData = document.createElement('td')
    tableData.innerText = value
    tableData.setAttribute('data-bs-toggle', 'modal')
    tableData.setAttribute('data-bs-target', '#addScoreModal')

    // tableData.addEventListener('click', (e) => {
    //     console.log('you clicked', e.target)
    // })

    parentEle.appendChild(tableData)
}

function addScoreBoxes (parentEle, scoresArr, len) {
    for (let i = 0; i < len; i++) {
        createTableData(parentEle, scoresArr[i] ? scoresArr[i] : '')
    }
}

function showScoreCard (parentEle) {
    let currentGame = getGolfScore()[0]
    let table = document.createElement('table')
    table.setAttribute('class', 'scoreTable')
    let holes = document.createElement('tr')
    let yards = document.createElement('tr')
    let par = document.createElement('tr')
    let holesHeader = document.createElement('th')
    let yardsHeader = document.createElement('th')
    let parHeader = document.createElement('th')

    holesHeader.innerText = 'Holes'
    yardsHeader.innerText = 'Yards'
    parHeader.innerText = 'Par'

    holes.appendChild(holesHeader)
    yards.appendChild(yardsHeader)
    par.appendChild(parHeader)


    currentGame.course.holes.forEach((hole) => {
        createTableData(holes, hole.hole)
        createTableData(yards, hole.changeLocations[0].yards)
        createTableData(par, hole.changeLocations[0].par)
    })

    table.appendChild(holes)
    table.appendChild(yards)
    table.appendChild(par)

    currentGame.players.forEach((player) => {
        let {name, scores} = player
        let playerRow = document.createElement('tr')
        let playerHeader = document.createElement('th')
        playerHeader.innerText = name
        playerRow.appendChild(playerHeader)

        addScoreBoxes(playerRow, scores, currentGame.course.holes.length)

        table.appendChild(playerRow)
    })


    parentEle.appendChild(table)
}

function updateLocalStorage(data, arr) {
    checkForGolfScore() ?? setInitialLocalStorage()

    let players = []
    let game = new Game(data, players)
    let golfScores = []
    
    arr.forEach(player => players.push(new Player(player)))
    golfScores.push(game)

    localStorage.setItem('golfScore', JSON.stringify(golfScores))
    showScoreCard(scoreCard)
}

async function getCourse(obj) {
    const response = await fetch(`http://uxcobra.com/golfapi/course${obj.course}.txt`)
    // console.log(response)
    const jsonResponse = await response.json()
    // console.log(jsonResponse)
    updateLocalStorage(jsonResponse.data, obj.players)
}


playGolfButton.addEventListener('click', () => {
    let playersArr = Array.from(document.getElementsByClassName('playerName'))
    let course = courseSelector.value 
    let players = []
    // console.log(playersArr)
    playersArr.forEach(player => players.push(player.value))
    getCourse({course, players})
})


addNewPlayerButton.addEventListener('click', () => {
    let newPlayerInput = document.createElement('input')
    newPlayerInput.setAttribute('class', 'playerName')
    newPlayerInput.setAttribute('type', 'text')
    playerInputs.appendChild(newPlayerInput)
})


addScoreModal.addEventListener('shown.bs.modal', (e) => {
    console.log('is this working?', e.target)
})

getGolfScore() ? showScoreCard(scoreCard) : console.log('no score card')

// async function get11819() {
//     let response = await (await fetch('http://uxcobra.com/golfapi/course11819.txt')).json()
//     console.log(response.data)
//     return response
// }
// async function get18300() {
//     let response = await (await fetch('http://uxcobra.com/golfapi/course18300.txt')).json()
//     console.log(response.data)
//     return response
// }
// async function get19002() {
//     let response = await (await fetch('http://uxcobra.com/golfapi/course19002.txt')).json()
//     console.log(response.data)
//     return response
// }


// get11819()
// get18300()
// get19002()


// async function getAvailableCourses() {
//     let results = await (await fetch('https://golf-courses-api.herokuapp.com/courses/', {mode: 'no-cors'})).json()
//       console.log(results.data)
//    }
   // getAvailableCourses()