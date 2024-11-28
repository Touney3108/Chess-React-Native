import { useState } from "react";
import { generateStartingBoard } from "../utilities/startingBoardCreator";
import { Square, Position } from "../types/boardScreenTypes";
import { getPossibleMovesForSelectedPiece } from "../utilities/getPossibleMovesForSelectedPiece";
//napraviti provjeru jel friendly kralj sahiran nakon izvrsenog poteza
function useBoardState() {
    const [boardState, setBoardState] = useState<Square[][]>(generateStartingBoard())
    const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
    const [possibleTargets, setPossibleTargets] = useState<Position[]>([]);
    const [pawnSwapPosition, setPawnSwapPosition] = useState<Position | null>(null);
    const [isEnemyChecked, setIsEnemyChecked] = useState(false);
    const [isPlayerChecked, setIsPlayerChecked] = useState(false);

    function selectPiece(row: number, col: number) {
        const selectedSquare: Square = boardState[row][col]
        if (selectedSquare.piece) {
            const piecePosition={row,col}
            const possibleMoves = getPossibleMovesForSelectedPiece(row, col, boardState);
            const newBoardState = getCopyOfABoardState()

            newBoardState[row][col] = {
                ...selectedSquare,
                selected: true
            }
            
            possibleMoves.forEach(pos => {
                newBoardState[pos.row][pos.col] = {
                    ...newBoardState[pos.row][pos.col],
                    canBeMovedTo: true
                }
            })
            
            setBoardState(newBoardState)
            setSelectedPiece(piecePosition)
            setPossibleTargets(possibleMoves);
        }
    }

    function deselectPiece() {
        if (selectedPiece) {
            const newBoardState = getCopyOfABoardState()
            const deselectedSquare = boardState[selectedPiece.row][selectedPiece.col]
            
            newBoardState[selectedPiece.row][selectedPiece.col] = deselectedSquare && {
                ...deselectedSquare,
                selected: false
            };

            possibleTargets.forEach(pos => newBoardState[pos.row][pos.col].canBeMovedTo = false);
            setPawnSwapPosition(null)
            setBoardState(newBoardState)
            setSelectedPiece(null)
            setPossibleTargets([]);
        }
    }

    function movePiece(targetRow: number, targetCol: number) {
        //pawn swap needs to be added
        //vidjeti za useCallback kod svih funkcija koje se passaju child componentama
        if (!selectedPiece) {
            console.error("movePiece function can't be called with selectedPiece state set to null in movePiece function")
            return;
        }
        
        const newBoardState = getCopyOfABoardState()
        const selectedPieceSquare = newBoardState[selectedPiece.row][selectedPiece.col]
        if (!selectedPieceSquare.piece) {
            console.error("newBoardState position of a piece has piece set to null in movePiece function")
            return;
        }
        
        let enPassantable = false;//possibility of special game rule for pawns
        
        if (selectedPieceSquare.piece.name === "pawn") { 
            if (targetRow === 0 || targetRow === 7) {
                setPawnSwapPosition({
                    row: targetRow,
                    col:targetCol
                });
                return;
            }
            else {
                enPassantable = selectedPiece.row === 1 &&
                    selectedPieceSquare.piece.isPieceWhite &&
                    targetRow === 3 ||
                    selectedPiece.row === 6 &&
                    !selectedPieceSquare.piece.isPieceWhite &&
                    targetRow === 4;
            }
        }
        else if (selectedPieceSquare.piece.name === "king") {
            handleCastling(newBoardState,selectedPiece,targetRow, targetCol);
        }
        
        //removes enpassant if other move was made
        if (!selectedPieceSquare.piece ||
            selectedPieceSquare.piece.name !== "pawn") {
            removeEnPassant(newBoardState,selectedPieceSquare)
            
        }

        for (let row = 0; row < 8; row++){
            for (let col = 0; col < 8; col++) {
                newBoardState[row][col].changedInPreviousTurn = false;
            }
            
        }
        newBoardState[targetRow][targetCol] = {
            ...selectedPieceSquare,
            selected: false,
            changedInPreviousTurn: true,
            piece: selectedPieceSquare.piece && {
                ...selectedPieceSquare.piece,
                pieceHasMoved: true,
                pawnPieceCanBeEnPassanted: enPassantable
            }
        }

        newBoardState[selectedPiece.row][selectedPiece.col] = {
            piece: null,
            selected: false,
            canBeMovedTo: false,
            changedInPreviousTurn:true,
        }

        possibleTargets.forEach(pos => newBoardState[pos.row][pos.col].canBeMovedTo = false);

        setBoardState(newBoardState)
        setSelectedPiece(null)
        setPossibleTargets([]);
    }


    const getCopyOfABoardState=()=>{
        const newCopy:Square[][]=boardState.map(row => row.map(square => ({ ...square })))
        return newCopy;
    }

    const removeEnPassant = (newBoardState:Square[][],selectedPieceSquare:Square) => {
        newBoardState
            .flat()
            .filter(square => {
            return square?.piece?.name === "pawn" &&
                square.piece.pawnPieceCanBeEnPassanted &&
                square.piece.isPieceWhite !== selectedPieceSquare.piece?.isPieceWhite;
            })
            .forEach(pawnSquare => pawnSquare.piece!.pawnPieceCanBeEnPassanted = false)
    }


    const handlePawnSwap = (type: string) => {
        if (!selectedPiece) {
            console.error("movePiece function can't be called with selectedPiece state set to null in movePiece function")
            return;
        }
        if (!pawnSwapPosition) {
            console.error("pawn swap position state is not set")
            return;
        }
        const newBoardState = getCopyOfABoardState()
        const selectedPieceSquare = newBoardState[selectedPiece.row][selectedPiece.col]
        if (!selectedPieceSquare.piece) {
            console.error("newBoardState position of a piece has piece set to null in movePiece function")
            return;
        }

        newBoardState[pawnSwapPosition.row][pawnSwapPosition.col] = {
            ...selectedPieceSquare,
            selected: false,
            changedInPreviousTurn: true,
            piece: selectedPieceSquare.piece && {
                ...selectedPieceSquare.piece,
                name:type,
                pieceHasMoved: true,
                pawnPieceCanBeEnPassanted: false
            }
        }

        newBoardState[selectedPiece.row][selectedPiece.col] = {
            piece: null,
            selected: false,
            canBeMovedTo: false,
            changedInPreviousTurn:true,
        }

        possibleTargets.forEach(pos => newBoardState[pos.row][pos.col].canBeMovedTo = false);

        setBoardState(newBoardState)
        setSelectedPiece(null)
        setPossibleTargets([]);
        setPawnSwapPosition(null);
    }
    const handleCastling = (newBoardState:Square[][],kingPosition:Position,targetRow:number,targetCol:number) => {
        if (kingPosition.col + 2 === targetCol) {
            const rook=newBoardState[targetRow][7]
            newBoardState[targetRow][targetCol-1] = {
                ...rook,
                changedInPreviousTurn: true,
                piece: rook.piece && {
                    ...rook.piece,
                    pieceHasMoved: true,
                    pawnPieceCanBeEnPassanted: false
                }
            }
            newBoardState[targetRow][7] = {
                piece: null,
                selected: false,
                canBeMovedTo: false,
                changedInPreviousTurn:true,
            }
        }
        else if (kingPosition.col - 2 === targetCol) {
            const rook=newBoardState[targetRow][0]
            newBoardState[targetRow][targetCol+1] = {
                ...rook,
                changedInPreviousTurn: true,
                piece: rook.piece && {
                    ...rook.piece,
                    pieceHasMoved: true,
                    pawnPieceCanBeEnPassanted: false
                }
            }
            newBoardState[targetRow][0] = {
                piece: null,
                selected: false,
                canBeMovedTo: false,
                changedInPreviousTurn:true,
            }
        }
    }
    
    return {
        boardState,
        selectedPiece,
        possibleTargets,
        isPlayerChecked,
        isEnemyChecked,
        selectPiece,
        deselectPiece,
        movePiece,
        pawnSwapPosition,
        handlePawnSwap
    }
}

export default useBoardState;