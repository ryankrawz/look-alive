export interface Deck {
    name: string;
    cards: string[];
    position: number;
    roundLengthSec: number;
    previousScore?: number;
}