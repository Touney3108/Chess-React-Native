import { useRef,useEffect } from "react";
import { StyleSheet,Pressable,Animated,Dimensions } from "react-native";
import colors from "../../styles/colors"
import { BoardSquareProps } from "../../types/boardScreenTypes";


const Pawn = require("../../assets/pieces/pawn.svg").default;
const King = require("../../assets/pieces/king.svg").default;
const Queen = require("../../assets/pieces/queen.svg").default;
const Bishop = require("../../assets/pieces/bishop.svg").default;
const Knight = require("../../assets/pieces/knight.svg").default;
const Rook = require("../../assets/pieces/rook.svg").default;
const MoveIndicator = require("../../assets/pieces/moveIndicator.svg").default;

const screenWidth = Dimensions.get("window").width;

function BoardSquare({ isSquareWhite, row, col, piece, selected, changedInPreviousTurn, isChecked,canBeMovedTo, animationTime, onSquarePressed }: BoardSquareProps) {
    const fillColor = piece?.isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor;
    const strokeColor = piece?.isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline;
    const squareColor = selected ? colors.selected :
        isChecked ? colors.checked :
        changedInPreviousTurn?colors.movedLastTurn:
        isSquareWhite ? colors.whiteBoardSquare : colors.blackBoardSquare
    
    const renderPiece = () => {
        switch (piece?.name) {
            case "pawn":return <Pawn width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "king":return <King width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "queen":return <Queen width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "rook":return <Rook width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "bishop":return <Bishop width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "knight":return <Knight width="100%" height="100%" fill={fillColor} stroke={strokeColor} />
            default: return null;
        }
    }

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(100)).current;
    useEffect(() => {
        if (canBeMovedTo&&animationTime) {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: animationTime,  
                useNativeDriver: true,
            }).start();
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: animationTime,  
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 0, 
                useNativeDriver: true,
            }).start();
            Animated.timing(opacityAnim, {
                toValue: 100,
                duration: 0,  
                useNativeDriver: true,
            }).start();
        }
    }, [canBeMovedTo]);

    
    
    return <Pressable
        onPress={() => { onSquarePressed(row, col) }}
        style={[styles.square,
            { backgroundColor: squareColor },
            col===0&&{borderLeftWidth:0},
            col === 7 && { borderRightWidth: 0 },
            row===0&&{borderTopWidth:0},
            row===7&&{borderBottomWidth:0},
        ]}>
        {renderPiece()}
        {canBeMovedTo && (
            <Animated.View style={[
                styles.indicatorContainer,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity:scaleAnim
                }
            ]}>
                <MoveIndicator width="100%" height="100%" fill={piece?colors.canGetAnotherPieceIndicator:colors.canMoveToIndicatorColor} />
            </Animated.View>
        )}
    </Pressable>
}

const styles = StyleSheet.create({
    square: {
        height: screenWidth*0.125,
        width: screenWidth*0.125, 
        borderWidth: 1,
        borderColor:colors.boardSquareBorder
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
