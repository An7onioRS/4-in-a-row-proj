const createGame = () => {
    return {
        board: createBoard(),
        ready: false,
        players: [
            player1 = createPlayer('Player 1', 1, true, '#e15258'),
            player2 = createPlayer('Player 2', 2, '#e59a13')
        ], 
        createPlayerTokens() {
            for (let player of this.players) {
                 player.tokens = constructTokens(player, 21)
            }
        },
        get activePlayer() {
            return this.players.find(player => player.active)
        },

        /**
        * Branches code, depending on what key player presses
        * @param   {Object}    e - Keydown event object
        */
        handleKeyDown(e) {
            if (!this.ready) {
            } else {
                if (e.key == 'ArrowLeft') {
                    this.activePlayer.activeToken.moveLeft()
                } else if (e.key == 'ArrowRight') {
                    this.activePlayer.activeToken.moveRight()
                } else if (e.key == 'ArrowDown') {
                    // token should fall
                }
            }
        },

        /** 
         * Initializes game. 
         */  
        startGame() {
            this.board.drawHTMLBoard()
            this.activePlayer.activeToken.drawHTMLToken()
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
        tokens: [],
        get unusedTokens() {
            return this.tokens.filter(token => !token.dropped)
        },
        get activeToken() {
            return this.unusedTokens[0]
        }
    }
}

const createBoard = () => {
    return {
        spaces: constructSpaces(6, 7),
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
        owner, // Allows access to the Player object (id and color) that owns the token  
        id: `token-${index}-${owner.id}`, // each token will be creating using a for loop, so we could use the index of the loop
        dropped: false,
        columnLocation: 0,
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
        },
        
        /** 
         * Gets left offset of html element.
         * @return  {number}   Left offset of token object's htmlToken
         */
        get offsetLeft() {
            return this.htmlToken.offsetLeft
        },

        /** 
         * Moves html token one column to left.
         */
        moveLeft() {
            if (this.columnLocation > 0) {
                this.htmlToken.style.left = this.offsetLeft - 76
                this.columnLocation -= 1
            }
        },

        /** 
         * Moves html token one column to right.
         * @param   {number}    columns - number of columns in the game board
         */
        moveRight(number) {
            if (this.columnLocation < number) {
                this.htmlToken.style.left = this.offsetLeft + 76
                this.columnLocation += 1
            }
        }
    }
}

const createSpace = (x, y) => {
    return {
        x,
        y,
        id: `space-${x}-${y}`,
        token: null,
        diameter: 76,
        radius: 38,
        drawSVGSpace: function() {
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
        const column = [] 

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
function constructTokens(owner, number) {
    const tokens = []
    for (let i = 0; i < number; i++) {
        tokens.push(createToken(owner, i))
    }

    return tokens
}

const game = createGame()

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
document.querySelector('#begin-game').addEventListener('click', function() {
    game.createPlayerTokens()
    game.startGame()
    this.style.display = 'none'
    document.querySelector('#play-area').style.opacity = '1'    
})

/** 
* Listen for keyboard presses
*/

document.addEventListener('keydown', (event) => {
    game.handleKeyDown(event)
})