export const piecesMovement = {
    king: {
        step: true,
        moves: [
            [0,1],
            [1,1],
            [1,0],
            [1,-1],
            [0,-1],
            [-1,-1],
            [-1,0],
            [-1,1],
        ]
    },
    queen: {
        step: false,
        moves: [
            [0,1],
            [1,1],
            [1,0],
            [1,-1],
            [0,-1],
            [-1,-1],
            [-1,0],
            [-1,1],
        ]
    },
    rook: {
        step: false,
        moves: [
            [0,1],
            [1,0],
            [0,-1],
            [-1,0],
        ]
    },
    bishop: {
        step: false,
        moves: [
            [1,1],
            [1,-1],
            [-1,-1],
            [-1,1],
        ]
    },
    knight: {
        step: true,
        moves: [
            [2,1],
            [2,-1],
            [1,2],
            [1,-2],
            [-2,1],
            [-2,-1],
            [-1,2],
            [-1,-2],
        ]
    },
}