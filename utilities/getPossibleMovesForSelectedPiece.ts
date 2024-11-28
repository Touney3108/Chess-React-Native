import { Position, Square,PieceMovement } from "../types/boardScreenTypes";
import { piecesMovement } from "./piecesMovement";
function getPossibleMovesOfAPiece(
    selectedRow: number,
    selectedCol: number,
    board: Square[][],
    checked:boolean=false,
): Position[] {
    const selectedSquare = board[selectedRow][selectedCol]
    if (!selectedSquare || !selectedSquare.piece) return []
    
    const possibleMoves: Position[] = [];
    const isntPartOfTheBoard = (row: number, col: number) => 0 > row || row > 7 || 0 > col || col > 7;
    const setMovesForPieceType=(pieceType: PieceMovement):void =>{
        if (!pieceType.step) {
            pieceType.moves.forEach((move: number[]) => {
                let targetedRow=selectedRow
                let targetedCol = selectedCol
                while (true) {
                    targetedRow+=move[0]
                    targetedCol+=move[1]
                    if (isntPartOfTheBoard(targetedRow,targetedCol)) return;
                    
                    const targetedSquare=board[targetedRow][targetedCol]
                    if (!targetedSquare.piece) {
                        possibleMoves.push({ row: targetedRow, col: targetedCol })
                        continue;
                    }
                    if (selectedSquare?.piece?.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                        possibleMoves.push({ row: targetedRow, col: targetedCol })
                    }
                    return
                }
                
            })
        } else {
            pieceType.moves.forEach((move: number[]) => {
                const targetedRow=selectedRow + move[0]
                const targetedCol=selectedCol + move[1]
                if (isntPartOfTheBoard(targetedRow, targetedCol)) return;
                
                const targetedSquare=board[targetedRow][targetedCol]
                if (!targetedSquare.piece) {
                    possibleMoves.push({ row: targetedRow, col: targetedCol })
                    return;
                }
                if (selectedSquare?.piece?.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                    possibleMoves.push({ row: targetedRow, col: targetedCol })
                    return;
                }
            })
        }
    }

    //switch cases are ordered by pieces with the most to least presence on the board for maximum efficiency
    switch (selectedSquare.piece.name) {
        case "pawn":
            const direction = selectedSquare.piece.isPieceWhite ? 1 : -1;
            if (!board[selectedRow + direction][selectedCol].piece) {
                possibleMoves.push({ row: selectedRow + direction, col: selectedCol })
                //only if first step is available check for double step if pawn has not moved yet
                if (!selectedSquare.piece.pieceHasMoved) {
                    if (!board[selectedRow + direction * 2][selectedCol].piece) {
                        possibleMoves.push({ row: selectedRow + direction * 2, col: selectedCol })
                    }
                }
            }
            
            //checks if pawn is on the right edge of the board and if there is a piece to be attacked
            if (selectedCol != 7) {
                const targetedSquare = board[selectedRow + direction][selectedCol + 1]
                const enPasantSquare= board[selectedRow][selectedCol + 1]
                if (targetedSquare.piece) {
                    if (selectedSquare.piece.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                        possibleMoves.push({ row: selectedRow + direction, col: selectedCol + 1 })
                    }
                }
                if (enPasantSquare.piece && enPasantSquare.piece.pawnPieceCanBeEnPassanted) {
                    if (selectedSquare.piece.isPieceWhite !== enPasantSquare.piece.isPieceWhite) {
                        possibleMoves.push({ row: selectedRow, col: selectedCol + 1 })
                    }
                }
            }
            //checks if pawn is on the left edge of the board and if there is a piece to be attacked
            if (selectedCol != 0) {
                const targetedSquare = board[selectedRow + direction][selectedCol - 1]
                const enPasantSquare= board[selectedRow][selectedCol - 1]
                //checks if two pieces are of different colors
                if (targetedSquare.piece) {
                    if (selectedSquare.piece.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                        possibleMoves.push({ row: selectedRow + direction, col: selectedCol - 1 })
                    }
                }
                if (enPasantSquare.piece && enPasantSquare.piece.pawnPieceCanBeEnPassanted) {
                    if (selectedSquare.piece.isPieceWhite !== enPasantSquare.piece.isPieceWhite) {
                        possibleMoves.push({ row: selectedRow, col: selectedCol -1 })
                    }
                }
            }
            break;
            
            case "rook":setMovesForPieceType(piecesMovement.rook);break;
            case "bishop":setMovesForPieceType(piecesMovement.bishop);break;
            case "knight": setMovesForPieceType(piecesMovement.knight);break;
            case "queen":setMovesForPieceType(piecesMovement.queen);break;
            case "king": setMovesForPieceType(piecesMovement.king);
                //if king is checked or king has moved castle wont be possible
                if (checked) break;
                if (selectedSquare.piece.pieceHasMoved) break;
                //checks if left castle is possible
                if (!board[selectedRow][selectedCol - 1].piece&&
                    !board[selectedRow][selectedCol - 2].piece&&
                    !board[selectedRow][selectedCol - 3].piece &&
                    board[selectedRow][selectedCol - 4]?.piece?.name === "rook" &&
                    !board[selectedRow][selectedCol - 4]?.piece?.pieceHasMoved
                ) {
                    possibleMoves.push({ row: selectedRow, col: selectedCol - 2 })
                }
                //checks if right castle is possible
                if (!board[selectedRow][selectedCol + 1].piece&&
                    !board[selectedRow][selectedCol + 2].piece&&
                    board[selectedRow][selectedCol + 3]?.piece?.name === "rook" &&
                    !board[selectedRow][selectedCol + 3]?.piece?.pieceHasMoved
                ) {
                    possibleMoves.push({ row: selectedRow, col: selectedCol + 2 })
                }
                break;
    }

    return possibleMoves;
}

export function getPossibleMovesForSelectedPiece(
    selectedRow: number,
    selectedCol: number,
    board: Square[][],
    checked: boolean = false,
): Position[] {
    
    const moves = getPossibleMovesOfAPiece(selectedRow, selectedCol, board, checked);
    if (moves.length === 0) return []
    
    const testingBoard = board.map(row => row.map(square => ({ ...square })));

    let selectedPiece = testingBoard[selectedRow][selectedCol].piece
    if (!selectedPiece) {
        console.error("selectedPiece in getPossibleMovesForSelectedPiece is null");
        return [];
    }
    selectedPiece = { ...selectedPiece }
    const isSelectedPieceWhite = selectedPiece.isPieceWhite
    
    const validMoves=moves.filter(move => {
        let attackedPiece = testingBoard[move.row][move.col].piece
        attackedPiece = attackedPiece ? { ...attackedPiece } : null;

        //set a move on a testing board
        testingBoard[move.row][move.col].piece = { ...selectedPiece }
        testingBoard[selectedRow][selectedCol].piece = null;

        const enemyPiecesSquares = [];
        for (let row = 0; row < testingBoard.length; row++){
            for (let col = 0; col < testingBoard[row].length; col++){
                const enemySquare = testingBoard[row][col];
                if (!enemySquare.piece) continue;
                if (enemySquare.piece.isPieceWhite === isSelectedPieceWhite) continue;
                enemyPiecesSquares.push({row,col})
            }
        }
        //check if any enemy piece is targeting friendly king after a move is done 
        const moveInvalid=enemyPiecesSquares.some(enemyPieceSquare => {
            const { row, col } = enemyPieceSquare;
            
            const enemySquareMoves = getPossibleMovesOfAPiece(row, col, testingBoard);
            const isFriendlyKingATarget=enemySquareMoves.some(enemyMove => {
                const friendlyPiece= testingBoard[enemyMove.row][enemyMove.col].piece
                if (!friendlyPiece) return false;
                return friendlyPiece.name === "king";
            })
            return isFriendlyKingATarget;
        })
        //resets the testing board and returns if move is valid
        testingBoard[move.row][move.col].piece = attackedPiece;
        testingBoard[selectedRow][selectedCol].piece = selectedPiece;
        return !moveInvalid

    })
    return validMoves;
}