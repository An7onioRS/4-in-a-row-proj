const createGame = (() => {
    let board = createBoard()
    let ready = false
    let players = [
        player1 = createPlayer('Player 1', 1, '#e15258', true),
        player2 = createPlayer('Player 2', 2, '#e59a13') 
    ]
    let createPlayerTokens = () => {
            for (let player of players) {
                 player.tokens = constructTokens(player, 21)
            }
        }
    let getActivePlayer = () => {
        return players.find(player => player.active)
    }

    /**
    * Branches code, depending on what key player presses
    * @param   {Object}    e - Keydown event object
    */
    let handleKeyDown = (e) => {
        let currActivePlayer = getActivePlayer()
        if (ready) {
            if (e.key == 'ArrowLeft') {
                currActivePlayer.activeToken.moveLeft()
            } else if (e.key == 'ArrowRight') {
                currActivePlayer.activeToken.moveRight(board.columns)
            } else if (e.key == 'ArrowDown') {
                playToken()
            }
        }
    }

    let playToken = () => {
        currActivePlayer = getActivePlayer()
        let spaces = board.spaces
        let activeToken = currActivePlayer.activeToken
        let targetColumn = spaces[activeToken.columnLocation]
        let targetSpace = null


        for (let space of targetColumn) {
            if (space.token === null) {
                targetSpace = space
            }
        }

        if (targetSpace !== null) {
            const game = this
            game.ready = false

            activeToken.drop(targetSpace, function() {
                game.updateGameState(activeToken, targetSpace);
            })
        }
    }

    /** 
     * Initializes game. 
     */  
    let startGame = () => {
        let currActivePlayer = getActivePlayer()
        board.drawHTMLBoard()
        currActivePlayer.activeToken.drawHTMLToken()
        ready = true
    }

    /** 
    * Checks if there a winner on the board after each token drop.
    * @param   {Object}    Targeted space for dropped token.
    * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
    */
    let checkForWin = (target) => {
        const owner = target.token.owner
        let win = false

        // vertical
        for (let x = 0; x < board.columns; x++ ){
            for (let y = 0; y < board.rows - 3; y++){
                if (board.spaces[x][y].owner === owner && 
                    board.spaces[x][y+1].owner === owner && 
                    board.spaces[x][y+2].owner === owner && 
                    board.spaces[x][y+3].owner === owner) {
                        win = true;
                }           
            }
        }

        // horizontal
        for (let x = 0; x < board.columns - 3; x++ ){
            for (let y = 0; y < board.rows; y++){
                if (board.spaces[x][y].owner === owner && 
                    board.spaces[x+1][y].owner === owner && 
                    board.spaces[x+2][y].owner === owner && 
                    board.spaces[x+3][y].owner === owner) {
                        win = true;
                }           
            }
        }

        // diagonal
        for (let x = 3; x < board.columns; x++ ){
            for (let y = 0; y < board.rows - 3; y++){
                if (board.spaces[x][y].owner === owner && 
                    board.spaces[x-1][y+1].owner === owner && 
                    board.spaces[x-2][y+2].owner === owner && 
                    board.spaces[x-3][y+3].owner === owner) {
                        win = true;
                }           
            }
        }

        // diagonal
        for (let x = 3; x < board.columns; x++ ){
            for (let y = 3; y < board.rows; y++){
                if (board.spaces[x][y].owner === owner && 
                    board.spaces[x-1][y-1].owner === owner && 
                    board.spaces[x-2][y-2].owner === owner && 
                    board.spaces[x-3][y-3].owner === owner) {
                        win = true;
                }           
            }
        }
        
        return win
    }

    /** 
    * Switches active player. 
    */
    const switchPlayers = () => {
        for (let player of players) {
            if (player.active) {
                player.active = false
            } else {
                player.active = true
            }
        } 
    }
    
    /** 
    * Displays game over message.
    * @param {string} message - Game over message.      
    */
    const gameOver = (message) => {
        let gameOverElement = document.querySelector('#game-over')
        gameOverElement.style.display = 'block'
        gameOverElement.textContent = message
    }

     /** 
     * Updates game state after token is dropped. 
     * @param   {Object}  token  -  The token that's being dropped.
     * @param   {Object}  target -  Targeted space for dropped token.
     */
    const updateGameState = (token, target) => {
        target.mark(token)
        currActivePlayer = getActivePlayer()

        if (!checkForWin(target)) {
            
            switchPlayers()

            if (currActivePlayer.checkTokens()) {
                currActivePlayer.activeToken.drawHTMLToken()
                ready = true
            } else {
                gameOver('Game over! No more tokens')
            }
        } else {
            gameOver(`${target.owner.name} wins`)
        }
    }
    return {
        createPlayerTokens,
        getActivePlayer,
        handleKeyDown,
        playToken,
        updateGameState,
        gameOver,
        switchPlayers,
        checkForWin,
        startGame
    }
})()

const createPlayer = (name, id, color, active = false) => {
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
        },
        
        /**
         * Check if a player has any undropped tokens left
         * @return {Boolean}
         */
        checkTokens() {
            return this.unusedTokens.length == 0 ? false : true
        }
    }
}

const createBoard = () => {
    return {
        rows: 6,
        columns: 7,
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
        },
        get htmlToken() {
            return document.querySelector(`#${this.id}`)
        },
        
        /** 
        * Drops html token into targeted board space.
        * @param   {Object}   target - Targeted space for dropped token.
        * @param   {function} reset  - The reset function to call after the drop animation has completed.
        */
        drop(target, reset) {
            this.dropped = true

            $(this.htmlToken).animate({
                top: (target.y * target.diameter)
            }, 750, 'easeOutBounce', reset)
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
        },

        /**
        * Updates space to reflect a token has been dropped into it.
        * @param {Object} token - The dropped token
        */
        mark(token) {
            this.token = token
        },

        /**
        * Checks if space has an associated token to find its owner
        * @return  {(null|Object)} Returns null or the owner object of the space's associated token.
        */
       get owner() {
            if (this.token !== null) {
                return this.token.owner
            }

            return null
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