import { View, StyleSheet,Pressable } from "react-native";
import colors from "../../styles/colors"
import { BoardSquareProps } from "./types";

const Pawn = require("../../assets/pieces/pawn.svg").default;
const King = require("../../assets/pieces/king.svg").default;
const Queen = require("../../assets/pieces/queen.svg").default;
const Bishop = require("../../assets/pieces/bishop.svg").default;
const Knight = require("../../assets/pieces/knight.svg").default;
const Rook = require("../../assets/pieces/rook.svg").default;
const MoveIndicator = require("../../assets/pieces/moveIndicator.svg").default;



function BoardSquare({ isSquareWhite, row,col,piece,selected,canBeMovedTo,onSquarePressed }: BoardSquareProps) {
    const renderPiece = () => {
        switch (piece?.name) {
            case "pawn":return <Pawn width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline}/>
            case "king":return <King width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline}/>
            case "queen":return <Queen width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline}/>
            case "rook":return <Rook width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline}/>
            case "bishop":return <Bishop width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline}/>
            case "knight":return <Knight width="100%" height="100%" fill={piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor} stroke={piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline} />
            default: return null;
        }
    }
    const squareColor = selected ? colors.selected :
        isSquareWhite ? colors.whiteBoardSquare : colors.blackBoardSquare
    return <Pressable
        onPress={() => { onSquarePressed(row, col) }}
        style={[styles.square,
        { backgroundColor:squareColor}]}>
        {renderPiece()}
        {canBeMovedTo && (
            <View style={styles.indicatorContainer}>
                <MoveIndicator width="100%" height="100%" fill={piece?colors.canGetAnotherPieceIndicator:colors.canMoveToIndicatorColor} />
            </View>
        )}
    </Pressable>
}

const styles = StyleSheet.create({
    square: {
        height: "12.5%",
        width: "12.5%", 
    },
    indicatorContainer: {
        height: "100%",
        width:"100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.75,
    },
})
export default BoardSquare
