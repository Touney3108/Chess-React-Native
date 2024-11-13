import { Dimensions, StyleSheet, View } from "react-native";
import BoardSquare from "./BoardSquare";
import { Square,Position } from "./types";
import { ColumnDictionary } from "../../utilities/ColumnDictionary";
import { generateStartingBoard } from "./startingBoardCreator";
import { useState } from "react";
import { piecesMovement } from "./piecesMovement";

const screenWidth = Dimensions.get("window").width;




function Board() {
    const [boardState, setBoardState] = useState(generateStartingBoard)
    const [selectedPiece, setSelectedPiece] = useState<Position|null>(null);

    function getCopyOfABoardState() {
        const newCopy:Square[][]=boardState.map(row => row.map(square => ({ ...square })))
        return newCopy;
    }

    function getPossibleMovesForSelectedPiece(selectedRow:number,selectedCol:number):Position[] {
        const selectedSquare = boardState[selectedRow][selectedCol]
        if(!selectedSquare)return []
        if (!selectedSquare.piece) return [];
        function getMovesForPieceType(pieceType: { step: boolean; moves: number[][]; }) {
            if (!pieceType.step) {
                pieceType.moves.forEach((move: number[]) => {
                    let targetedRow=selectedRow
                    let targetedCol = selectedCol
                    while (true) {
                        console.log("queen")
                        targetedRow+=move[0]
                        targetedCol+=move[1]
                        if (0 > targetedRow || targetedRow > 7) return;
                        if (0 > targetedCol || targetedCol > 7) return;
                        const targetedSquare=boardState[targetedRow][targetedCol]
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
                    if (0 > targetedRow || targetedRow > 7) return;
                    if (0 > targetedCol || targetedCol > 7) return;
                    const targetedSquare=boardState[targetedRow][targetedCol]
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
        const possibleMoves: Position[] = [];
        switch (selectedSquare.piece.name) {
            case "pawn":
                
                const direction = selectedSquare.piece.isPieceWhite ? 1 : -1;
                if (!boardState[selectedRow + direction][selectedCol].piece) {
                    possibleMoves.push({ row: selectedRow + direction, col: selectedCol })
                    //only if first step is available check for double step if pawn has not moved yet
                    if (!selectedSquare.piece.pieceHasMoved) {
                        if (!boardState[selectedRow + direction * 2][selectedCol].piece) {
                            possibleMoves.push({ row: selectedRow + direction * 2, col: selectedCol })
                        }
                    }
                }
                //checks if pawn is on right end of board and if there is piece to be attacked
                if (selectedCol != 7 && boardState[selectedRow + direction][selectedCol + 1].piece) {
                    const targetedSquare = boardState[selectedRow + direction][selectedCol + 1]
                    if (targetedSquare.piece) {
                        if (selectedSquare.piece.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                            possibleMoves.push({ row: selectedRow + direction, col: selectedCol + 1 })
                        }
                    }
                }
                //checks if pawn is on left end of board and if there is piece to be attacked
                if (selectedCol != 0 && boardState[selectedRow + direction][selectedCol - 1].piece) {
                    const targetedSquare = boardState[selectedRow + direction][selectedCol - 1]
                    //checks if two pieces are of different colors
                    if (targetedSquare.piece) {
                        if (selectedSquare.piece.isPieceWhite !== targetedSquare.piece.isPieceWhite) {
                            possibleMoves.push({ row: selectedRow + direction, col: selectedCol - 1 })
                        }
                    }
                }
                //ENPASANT needs to be added
                break;
                
            case "king": getMovesForPieceType(piecesMovement.king);break;
            case "queen":getMovesForPieceType(piecesMovement.queen);break;
            case "rook":getMovesForPieceType(piecesMovement.rook);break;
            case "bishop":getMovesForPieceType(piecesMovement.bishop);break;
            case "knight": getMovesForPieceType(piecesMovement.knight);break;
            default: return [];
        }
        return possibleMoves;
        

    }

    function onSquarePressed(row: number, col: number): void{
        const pressedSquare:Square=boardState[row][col]
        if (!selectedPiece) {
            if (pressedSquare.piece) {
                const newBoardState = getCopyOfABoardState()
                newBoardState[row][col]={...pressedSquare,selected:true}
                const possibleMoves = getPossibleMovesForSelectedPiece(row, col);
                console.log(possibleMoves)
                possibleMoves.forEach(pos => {
                    newBoardState[pos.row][pos.col]={...newBoardState[pos.row][pos.col],canBeMovedTo:true}
                })
                
                setBoardState(newBoardState)
                setSelectedPiece({ row, col })
                console.log(`Selected piece`);
                return
            }
            console.log("Selected square")
            return;
        }
        if (selectedPiece.row === row && selectedPiece.col === col) {
            const newBoardState = getCopyOfABoardState()
            newBoardState[row][col] = pressedSquare && { ...pressedSquare, selected: false };
            newBoardState.forEach(row => row.forEach(sqr => sqr.canBeMovedTo = false));
            setBoardState(newBoardState)
            setSelectedPiece(null)
            console.log(`Unselected piece`);
            return;
        }
        const newBoardState = getCopyOfABoardState()
        const selectedSquare=newBoardState[selectedPiece.row][selectedPiece.col]
        newBoardState[row][col]={...selectedSquare,selected:false,changedInPreviousTurn:true,piece:selectedSquare.piece&&{...selectedSquare.piece,pieceHasMoved:true,}}
        newBoardState[selectedPiece.row][selectedPiece.col] = {piece:null,
            selected: false,
            canBeMovedTo: false,
            changedInPreviousTurn:true,
        }
        newBoardState.forEach(row => row.forEach(sqr => sqr.canBeMovedTo = false));
        setSelectedPiece(null)
        setBoardState(newBoardState)
        console.log(`Piece ${selectedPiece.row}, col: ${selectedPiece.col} moved to ${row}, col: ${col}`);
    }
    const playerIsBlack = true;
    const squares = [];
    for(let row=playerIsBlack?0:7;playerIsBlack?row<8:row>=0;playerIsBlack?row++:row--){
        for(let col=0;col<8;col++){
            const isWhite = (row + col) % 2 === 0;
            const square=boardState[row][col]
            
            squares.push(<BoardSquare
                onSquarePressed={onSquarePressed}
                isSquareWhite={isWhite}
                row={row}
                col={col}
                key={"" + row + col}
                piece={square.piece}
                selected={ square&&square.selected }
                canBeMovedTo={ square&&square.canBeMovedTo }
            />)
        }
    }
    return <View style={styles.board}>
        {
        squares
        }
        
    </View>
}

const styles = StyleSheet.create({
    board: {
        flexDirection:"row",
        flexWrap:"wrap",
        width: screenWidth * 0.98,
        height: screenWidth * 0.98,
        alignSelf: "center",
        justifyContent: "center",
    }
})
export default Board;