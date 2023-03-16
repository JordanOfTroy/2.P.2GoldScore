let courseSelector = document.getElementById('courseSelect')
let playGolfButton = document.getElementById('playGolf')
// let playersArr = Array.from(document.getElementsByClassName('playerName'))
let playerInputs = document.querySelector('.playerInputs')
let addNewPlayerButton = document.getElementById('addNewPlayer')
let scoreCard = document.getElementById('scoreCard')
let addScoreModal = document.getElementById('addScoreModal')
let modalHeader = document.getElementById('addScoreModalLabel')
let IdCount = 0
let scoreButton = document.getElementById('scoreButton')

const PRO = 'pro'
const CHAMP = 'champion'
const MENS = 'men'
const WOMENS = 'women'
const AUTOCHANGE = 'auto change location'

class Player {
    constructor(obj, id = getNextID(), scores = []) {
        this.name = obj.name,
        this.id = id,
        this.scores = scores,
        this.tee = obj.tee
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

function createTableData(parentEle, value, i) {
    let playerName = parentEle.getAttribute('data-player-name')
    let tableData = document.createElement('td')
    tableData.innerText = value
    tableData.setAttribute('data-bs-toggle', 'modal')
    if (playerName) {
        tableData.setAttribute('class', 'scoreBox')
        tableData.setAttribute('data-bs-target', '#addScoreModal')
        tableData.setAttribute('data-player-name', `${playerName}`)
        tableData.setAttribute('data-index', `${i}`)
    }

    parentEle.appendChild(tableData)
}

function addTeaboxYardage (parentEle, siblingEle, arr, str) {
    let teeBoxYardage = document.createElement('tr')

    let yardageHeader = document.createElement('th')
    yardageHeader.setAttribute('class', 'subtleHeader')
    yardageHeader.innerText = 'Yards'
    teeBoxYardage.appendChild(yardageHeader)

    arr.forEach((obj) => {
        let courseTeeBoxes = obj.teeBoxes
        courseTeeBoxes.forEach(box => {
            if (box.teeType === str) {
                let yardageBox = document.createElement('td')
                yardageBox.innerText = box.yards
                yardageBox.setAttribute('class', 'subtleHeader')
                
                teeBoxYardage.appendChild(yardageBox)
            } 
        })
    })
    
    parentEle.insertBefore(teeBoxYardage, siblingEle)
}

function addHCP(parentEle, siblingEle, arr, str) {
    let hcpBox = document.createElement('tr')
    
    let hcpHeader = document.createElement('th')
    hcpHeader.setAttribute('class', 'subtleHeader')
    hcpHeader.innerText = 'HCP'
    hcpBox.appendChild(hcpHeader)
    
    arr.forEach((obj) => {
        let courseTeeBoxes = obj.teeBoxes
        courseTeeBoxes.forEach(box => {
            if (box.teeType === str) {
                let hcp = document.createElement('td')
                hcp.setAttribute('class', 'subtleHeader')
                hcp.innerText = box.hcp

                hcpBox.appendChild(hcp)
            } 
        })
    })

    parentEle.insertBefore(hcpBox, siblingEle)
}

function addScoreBoxes (parentEle, scoresArr, len) {
    for (let i = 0; i < len; i++) {
        createTableData(parentEle, scoresArr[i] ? scoresArr[i] : '', i)
    }
}


function showScoreCard (parentEle) {
    let currentGame = getGolfScore()[0]
    let table = document.createElement('table')
    table.setAttribute('class', 'scoreTable table')
    let holes = document.createElement('tr')
    let par = document.createElement('tr')
    let holesHeader = document.createElement('th')
    let parHeader = document.createElement('th')

    holesHeader.innerText = 'Holes'
    parHeader.innerText = 'Par'

    holes.appendChild(holesHeader)
    par.appendChild(parHeader)


    currentGame.course.holes.forEach((hole) => {
        createTableData(holes, hole.hole)
        createTableData(par, hole.changeLocations[0].par)
    })

    table.appendChild(holes)
    table.appendChild(par)
    
    currentGame.players.forEach((player) => {
        let {name, scores, tee} = player
        let playerRow = document.createElement('tr')
        playerRow.setAttribute('data-player-name', `${name}`)
        let playerHeader = document.createElement('th')
        playerHeader.innerText = name
        
        playerRow.appendChild(playerHeader)
        table.appendChild(playerRow)
        
        addScoreBoxes(playerRow, scores, currentGame.course.holes.length)
        addTeaboxYardage(table, playerRow, currentGame.course.holes, tee)
        addHCP(table, playerRow, currentGame.course.holes, tee)
    })
    
    parentEle.appendChild(table)
}

function updateLocalStorage(data, arr) {
    checkForGolfScore() ?? setInitialLocalStorage()

    let players = []
    let game = new Game(data, players)
    let golfScores = []
    
    arr.forEach(player => {
        console.log(player)
        players.push(new Player(player))
    })
    golfScores.push(game)

    localStorage.setItem('golfScore', JSON.stringify(golfScores))
    showScoreCard(scoreCard)
}

async function getCourse(obj) {
    const response = await fetch(`http://uxcobra.com/golfapi/course${obj.course}.txt`)
    const jsonResponse = await response.json()
    updateLocalStorage(jsonResponse.data, obj.players)
}

function updateLocalStorageScores(playerObj, ind, value) {
    let {name, tee} = playerObj
    let course = getGolfScore()[0]
    
    course.players.forEach((player) => {
        if (player.name === name) {
            player.scores[ind] = value
            plater.tee = tee
            localStorage.setItem('golfScore', JSON.stringify([course]))
        }
    })
}

function updatePlayerScore () {
    let input = document.getElementById('newScoreInput')
    let scoreBoxArr = Array.from(document.getElementsByClassName('scoreBox'))

    scoreBoxArr.forEach((box) => {
        let updating = box.getAttribute('data-selected-for-updating')
        if (updating) {
            let currentValue = input.value
            let index = box.getAttribute('data-index')
            let player = box.getAttribute('data-player-name')
            box.innerHTML = input.value
            box.removeAttribute('data-selected-for-updating')
            input.value = ''
            updateLocalStorageScores(player, index, currentValue)
        }
    })
}


playGolfButton.addEventListener('click', () => {
    let playerNamesArr = Array.from(document.getElementsByClassName('playerName'))
    let playerTeeBoxArr = Array.from(document.getElementsByClassName('teeBox'))
    let course = courseSelector.value 
    let players = []

    playerNamesArr.forEach((player, ind) => {
        let playerObj = {}
        playerObj.name = player.value
        playerObj.tee = playerTeeBoxArr[ind].value
        console.log(playerObj)
        players.push(playerObj)
    })

    getCourse({course, players})
})

addNewPlayerButton.addEventListener('click', () => {
    let playerDiv = document.createElement('div')
    playerDiv.setAttribute('class', 'playerInput d-flex flex-column m-1')

    let newPlayerInput = document.createElement('input')
    newPlayerInput.setAttribute('class', 'playerName')
    newPlayerInput.setAttribute('type', 'text')

    let teaBoxSelect = document.createElement('select')
    teaBoxSelect.setAttribute('class', 'teeBox')

    let defaultOption = document.createElement('option')
    defaultOption.setAttribute('value', '')
    defaultOption.setAttribute('disabled', true)
    defaultOption.setAttribute('selected', true)
    defaultOption.innerText = 'Select Tee Box'
    
    let proOption = document.createElement('option')
    proOption.setAttribute('value', 'pro')
    proOption.innerText = 'Professional'
    
    let championOption = document.createElement('option')
    championOption.setAttribute('value', 'champion')
    championOption.innerText = 'Champion'
    
    let mensOption = document.createElement('option')
    mensOption.setAttribute('value', 'men')
    mensOption.innerText = 'Men\'s'
    
    let womensOption = document.createElement('option')
    womensOption.setAttribute('value', 'women')
    womensOption.innerText = 'Women\'s'

    teaBoxSelect.appendChild(defaultOption)
    teaBoxSelect.appendChild(proOption)
    teaBoxSelect.appendChild(championOption)
    teaBoxSelect.appendChild(mensOption)
    teaBoxSelect.appendChild(womensOption)

    playerDiv.appendChild(newPlayerInput)
    playerDiv.appendChild(teaBoxSelect)

    playerInputs.appendChild(playerDiv)
})

addScoreModal.addEventListener('shown.bs.modal', (e) => {
    let scoreBox = e.relatedTarget
    let selectedPlayer = scoreBox.getAttribute('data-player-name')
    let index = scoreBox.getAttribute('data-index')
    modalHeader.innerText = `Add score for ${selectedPlayer}`
    let input = document.getElementById('newScoreInput')
    input.setAttribute('data-index', `${index}`)

    scoreBox.setAttribute('data-selected-for-updating', true)


    document.getElementById('addNewScoreButton').addEventListener('click', () => {
        updatePlayerScore()

        // ger player socres
        // player HCPs
        //--- set data-player name to hcpBoxes for easy access
        // add up scores and deduct HCPs
    })
})

scoreButton.addEventListener('click', () => {
    console.log('you want to score the game?')
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