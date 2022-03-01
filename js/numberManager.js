import { NumberItem } from "./item";

export class NumberManager {
    constructor() {
        /** @type {Map<number, NumberItem>} */
        this.numberToItem = new Map();
    }

    /**
     * @param {number} number
     * @returns {NumberItem}
     */
    getItem(number) {
        number = Math.floor(number * 10000) / 10000;

        if (this.numberToItem.has(number)) {
            return this.numberToItem.get(number);
        }

        const item = new NumberItem(number);
        this.numberToItem.set(number, item);
        return item;
    }
}
