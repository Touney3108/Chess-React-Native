import { Pressable, View, TouchableOpacity, StyleSheet,Dimensions } from "react-native"
import colors from "../../styles/colors";

const Queen = require("../../assets/pieces/queen.svg").default;
const Bishop = require("../../assets/pieces/bishop.svg").default;
const Knight = require("../../assets/pieces/knight.svg").default;
const Rook = require("../../assets/pieces/rook.svg").default;

const screenWidth = Dimensions.get("window").width;


interface PawnSwapMenuProps{
    handlePawnSwap: (type: string) => void;
    onDismiss: () => void;
    position:{row:number,col:number}
}
function PawnSwapMenu({ handlePawnSwap, onDismiss, position }: PawnSwapMenuProps) {
    const isPieceWhite = position.row === 7 ? true : false;
    const fillColor = isPieceWhite ? colors.whitePieceColor : colors.blackPieceColor
    const strokeColor = isPieceWhite ? colors.whitePieceOutline : colors.blackPieceOutline
    const menuBg = isPieceWhite ? { backgroundColor: colors.neutralDark } : { backgroundColor: colors.neutralLight };
    const menuPosition = position.col < 4 ?
        { top: position.row,left: position.col * screenWidth * 0.125 } :
        { top: position.row,right: (7 - position.col) * screenWidth * 0.125 }
    
    const renderPiece = (type:string) => {
        switch (type) { case "queen":return <Queen width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "rook":return <Rook width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "bishop":return <Bishop width="100%" height="100%" fill={fillColor} stroke={strokeColor}/>
            case "knight":return <Knight width="100%" height="100%" fill={fillColor} stroke={strokeColor} />
            default: return null;
        }
    }
    
    return (
        <Pressable style={styles.overlay} onPress={onDismiss}>
            <View style={[styles.menuContainer, menuPosition,menuBg]}>
                {["queen", "rook", "bishop", "knight"].map((type,index) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.menuButton,
                            index!==0&&styles.menuButtonBorder
                        ]}
                        onPress={() => handlePawnSwap(type)}
                    >
                        {renderPiece(type)}
                    </TouchableOpacity>
                ))}
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    menuContainer: {
        position: "absolute",
        top:-screenWidth*0.125,
        padding: screenWidth*0.013,
        borderRadius: screenWidth*0.01,
        elevation: screenWidth*0.013,
        flexDirection: "row",
    },
    menuButton: {
        width: screenWidth * 0.125,
        height: screenWidth * 0.125,
    },
    menuButtonBorder:{
        borderLeftWidth: 1,
        borderLeftColor:colors.neutral,
    },
    menuButtonText: {
        color: "white",
        fontSize: 14,
    },
});

export default PawnSwapMenu