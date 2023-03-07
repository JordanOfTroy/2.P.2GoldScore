let courseSelector = document.getElementById('courseSelect')
let playGolfButton = document.getElementById('playGolf')
let playersArr = Array.from(document.getElementsByClassName('playerName'))
let addNewPlayerButton = document.getElementById('addNewPlayer')
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

function updateLocalStorage(data, arr) {
    checkForGolfScore() ?? setInitialLocalStorage()

   let players = []
   arr.forEach(player => players.push(new Player(player)))
   let game = new Game(data, players)
   let golfScores = getGolfScore()
   golfScores.push(game)
    localStorage.setItem('golfScore', JSON.stringify(golfScores))
}

async function getCourse(obj) {
    (await fetch(`http://uxcobra.com/golfapi/course${obj.course}.txt`)).json().then((res, rej) => {
      updateLocalStorage(res.data, obj.players)
    })
  
}

playGolfButton.addEventListener('click', () => {
    let course = courseSelector.value 
    let players = []
    playersArr.forEach(player => players.push(player.value))
    getCourse({course, players})
})



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