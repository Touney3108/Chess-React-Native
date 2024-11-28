import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import BoardScreen from './screens/BoardScreen';

const ChessApp: React.FC = () => {
    const [gameState, setGameState] = useState<any | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        // Monitor network connection
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected?true:false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isConnected) {
            // Connect to WebSocket server
            const webSocket = new WebSocket('ws://192.168.183.33:8080/ws'); // Use your public IP or localhost if testing on the same device

            webSocket.onopen = () => {
                console.log('WebSocket connection established');
            };

            webSocket.onmessage = (event: MessageEvent) => {
                const newGameState = JSON.parse(event.data);
                setGameState(newGameState);
            };

            webSocket.onerror = (error: Event) => {
                console.error('WebSocket error:', error);
            };

            setWs(webSocket);

            return () => {
                webSocket.close();
            };
        }
    }, [isConnected]);

    return (
        <View style={styles.container}>
            {gameState ? (
                <Text>Game State: {JSON.stringify(gameState)}</Text>
            ) : (
                <BoardScreen/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChessApp;