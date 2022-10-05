const game = () => {

}

const createPlayer = (name, id, active = false, color) => {
    return {
        name,
        id,
        active,
        color,
        tokens:  createTokens(21), // a method will be written later that will be creating the tokens
        
        /**
         * Creates token objects for player
         * @param {integer} num - Number of token objects to be created
         */

        createTokens(number) {
            const tokens = []
            for (let i = 0; i < number; i++) {
                tokens.push(createToken(this, i))
            }

            return tokens
        }
    }
}

const createBoard = () => {

}

const createToken = (owner, index) => {
    return {
        owner, // allows access to the Player object (id and color) that owns the token  
        id: `token-${index}-${owner.id}`, // each token will be creating using a for loop, so we could use the index of the loop
        dropped: false 
    }
}

const createSpace = () => {

}