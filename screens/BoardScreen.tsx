import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Board from "../components/boardscreen/Board";
import colors from "../styles/colors";
function BoardScreen() {
    
    return <SafeAreaView style={styles.container}>
        <Board/>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default BoardScreen;