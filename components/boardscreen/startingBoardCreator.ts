import { Square } from "./types";
export const generateStartingBoard = () => {
    const startingBoardPieces: Square[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            let isPieceWhite:boolean|null=null;
            let piece: string | null = null;

            if(i===0||i===1)isPieceWhite=true
            else if (i === 6 || i === 7) isPieceWhite = false

            if (i === 1 || i === 6) piece = "pawn"
            else if (i === 0 || i === 7) {
                if(j===0||j===7) piece="rook"
                else if(j===1||j===6) piece="knight"
                else if(j===2||j===5) piece="bishop"
                else if(j===3) piece="queen"
                else if(j===4) piece="king"
            }
            startingBoardPieces[i][j] = {
                piece: piece&&isPieceWhite!==null ? {
                    name: piece,
                    isPieceWhite,
                    pieceHasMoved: false,
                    pawnPieceCanBeEnPassanted: false,
                    
                } : null,
                selected: false,
                canBeMovedTo: false,
                changedInPreviousTurn:false,
            }
        }  
    }
    return startingBoardPieces;
}
