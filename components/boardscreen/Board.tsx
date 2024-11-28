import { Dimensions, StyleSheet, View } from "react-native";
import BoardSquare from "./BoardSquare";
import useBoardState from "../../hooks/useBoardState";
import { useMemo } from "react";
import PawnSwapMenu from "./PawnSwapMenu";
//import { ColumnDictionary } from "../../utilities/columnDictionary";

const screenWidth = Dimensions.get("window").width;


function Board() {
    const { boardState,
        selectedPiece,
        selectPiece,
        deselectPiece,
        movePiece,
        possibleTargets,
        pawnSwapPosition,
        handlePawnSwap
        } = useBoardState();
    
    function onSquarePressed(row: number, col: number): void{
        if (!selectedPiece) {
            selectPiece(row, col);
            return
        }

        const isSquareSelected = selectedPiece.row === row && selectedPiece.col === col;
        if (isSquareSelected) {
            deselectPiece();
            return;
        }

        const isTargetSelected = possibleTargets.some(square => square.row === row && square.col === col);
        if (isTargetSelected) {
            movePiece(row, col);
            return;
        }
        
        deselectPiece();
    }
    function onDismissPawnSwapMenu() {
        deselectPiece();
    }

    const playerIsBlack = true;
    const calculateDistance = (row: number, col: number) => {
        if (!selectedPiece) return 0;
        const x = Math.abs(selectedPiece.row - row)
        const y = Math.abs(selectedPiece.col - col)
        return Math.sqrt(x*x+y*y);
    };

    const board = useMemo(() => {
        return playerIsBlack ? boardState : [...boardState].reverse();
    }, [boardState]) 
    
    return <View style={styles.board}>
        {
            board.map((row, rowIndex) => (
                row.map((square, colIndex) => {
                    const distance = calculateDistance(rowIndex, colIndex);
                    const animationTime = distance * 100;
                    return (
                    
                        <BoardSquare
                            onSquarePressed={onSquarePressed}
                            isSquareWhite={(rowIndex + colIndex) % 2 === 0}
                            row={rowIndex}
                            col={colIndex}
                            key={"" + rowIndex + colIndex}
                            piece={square.piece}
                            selected={square && square.selected}
                            changedInPreviousTurn={square && square.changedInPreviousTurn}
                            isChecked={square && false}
                            canBeMovedTo={square && square.canBeMovedTo}
                            animationTime={animationTime}
                        />
                    )
                    }
            )))
        }
        {pawnSwapPosition && (
         <PawnSwapMenu handlePawnSwap={handlePawnSwap} onDismiss={onDismissPawnSwapMenu} position={{row:0,col:6}} />
        )}
    </View>
}

const styles = StyleSheet.create({
    board: {
        flexDirection:"row",
        flexWrap:"wrap",
        width: screenWidth,
        height: screenWidth,
        alignSelf: "center",
        justifyContent: "center",
    },
    
})
export default Board;