import { NgOption } from "@ng-select/ng-select";

export class NumericFilter{
    value: number;
    numericFilterComparator: NumericFilterComparator = NumericFilterComparator.OrLess;
}
export class InventoryFilters<T = Payload | NgOption> {
    isInventoryMode: boolean = false;
    squareFootage: NumericFilter = new NumericFilter;
    heatedSquareFootage: NumericFilter = new NumericFilter;
    beds: NumericFilter = new NumericFilter;
    baths: NumericFilter = new NumericFilter;
    floors: NumericFilter = new NumericFilter;
    garage: NumericFilter = new NumericFilter;
    garageTypes: T[];
    frontPatios: T[];
    decks: T[];
}

export type Payload = number | boolean;

export enum NumericFilterComparator {
    OrLess,
    OrMore
}