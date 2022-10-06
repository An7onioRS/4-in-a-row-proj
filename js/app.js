const createGame = () => {
    return {
        board: createBoard(),
        ready: false,
        players: [
            player1 = createPlayer('Player 1', 1, true, '#e15258'),
            player2 = createPlayer('Player 2', 2, '#e59a13')
        ], 
        get activePlayer() {
            return this.players.find(player => player.active)
        }, 

        /** 
         * Initializes game. 
         */  
        startGame() {
            board.drawHTMLBoard()
            activePlayer.activeToken.drawHTMLToken()
            ready = true
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
        get unusedTokens() {
            return tokens.filter(token => !token.dropped)
        },
        get activeToken() {
            return this.unusedTokens[0]
        }
    }
}

const createBoard = () => {
    return {
        rows: 6,
        columns: 7,
        spaces: constructSpaces(this.rows, this.columns),
        drawHTMLBoard() {
            for (let column of this.spaces) {
                for (let space of column) {
                    space.drawSVGSpace()
                }
            }
        }
    }
}

const createToken = (owner, index) => {
    return {
        owner, // allows access to the Player object (id and color) that owns the token  
        id: `token-${index}-${owner.id}`, // each token will be creating using a for loop, so we could use the index of the loop
        dropped: false,
        drawHTMLToken() {
            let div = document.createElement('div')
            document.querySelector('#game-board-underlay')
                .appendChild(div)
            div.setAttribute('id', this.id)
            div.setAttribute('class', 'token')
            div.style.backgroundColor = this.owner.color

            return div
        },
        get htmlToken() {
            return document.querySelector(`#${this.id}`)
        }
    }
}

const createSpace = (x, y) => {
    return {
        x,
        y,
        id: `space-${x}-${y}`,
        token: null,
        radius: diameter / 2,
        diameter: 76,
        drawSVGSpace: () => {
            const svgSpace = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            svgSpace.setAttributeNS(null, "id", this.id)
            svgSpace.setAttributeNS(null, "cx", (this.x * this.diameter) + this.radius)
            svgSpace.setAttributeNS(null, "cy", (this.y * this.diameter) + this.radius)
            svgSpace.setAttributeNS(null, "r", this.radius - 8)
            svgSpace.setAttributeNS(null, "fill", "black")
            svgSpace.setAttributeNS(null, "stroke", "none")
            
            document.querySelector('#mask').appendChild(svgSpace)  
        }
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