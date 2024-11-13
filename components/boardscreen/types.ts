export type Square = {
    piece: Piece|null,
    canBeMovedTo: boolean,
    changedInPreviousTurn:boolean,
    selected: boolean,
}
export type Piece = {
    name:string
    isPieceWhite: boolean,
    pieceHasMoved: boolean,
    pawnPieceCanBeEnPassanted: boolean,
}
export interface BoardSquareProps {
    piece: Piece|null;
    isSquareWhite: boolean; 
    selected: boolean|null;
    canBeMovedTo: boolean|null;
    row: number;
    col: number;
    onSquarePressed: (row:number,col:number) => void;
    
}
export type Position = {
    row: number,
    col: number
}
