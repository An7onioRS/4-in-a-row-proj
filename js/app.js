const createGame = () => {
    return {
        board: createBoard(),
        ready: false,
        players: [
            player1 = createPlayer('Player 1', 1, true, '#e15258'),
            player2 = createPlayer('Player 2', 2, '#e59a13')
        ],    
        startGame() {

        }

    }
}

const createPlayer = (name, id, active = false, color) => {
    return {
        name,
        id,
        active,
        color,
        tokens: constructTokens(21), // a method will be written later that will be creating the tokens
    }
}

const createBoard = () => {
    return {
        rows: 6,
        columns: 7,
        spaces: constructSpaces(this.rows, this.columns),
    }
}

const createToken = (owner, index) => {
    return {
        owner, // allows access to the Player object (id and color) that owns the token  
        id: `token-${index}-${owner.id}`, // each token will be creating using a for loop, so we could use the index of the loop
        dropped: false 
    }
}

const createSpace = (x, y) => {
    return {
        x,
        y,
        id: `space-${x}-${y}`,
        token: null
    }
}

/** 
 * Generates 2D array of spaces. 
 * @return  {Array}     An array of space objects
 */
function constructSpaces(rows, columns) {
    const spaces = []

    for (let i = 0; i < columns; i++) {
        const column =[] 

        for (let j = 0; j < rows; j++) {
            column.push(createSpace(i, j))
        }
        spaces.push(column)
    }

    return spaces
    }

/**
 * Creates token objects for player
 * @param {integer} num - Number of token objects to be created
 */
function constructTokens(number) {
    const tokens = []
    for (let i = 0; i < number; i++) {
        tokens.push(createToken(this, i))
    }

    return tokens
}

const game = createGame()

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
document.querySelector('#begin-game').addEventListener('click', function() {
    game.startGame()
    this.style.display = 'none'
    document.querySelector('#play-area').style.opacity = '1'
})