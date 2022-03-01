import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { DrawParameters } from "shapez/core/draw_parameters";
import { BaseItem } from "shapez/game/base_item";
import { types } from "shapez/savegame/serialization";

export class NumberItem extends BaseItem {
    static getId() {
        return "number";
    }

    static getSchema() {
        return types.float;
    }

    serialize() {
        return this.number;
    }

    deserialize(data) {
        this.number = data;
    }

    /** @returns {"number"} **/
    getItemType() {
        return "number";
    }

    /**
     * @returns {string}
     */
    getAsCopyableKey() {
        return String(this.number);
    }

    /**
     * @param {BaseItem} other
     */
    equalsImpl(other) {
        return this.number === /** @type {NumberItem} */ (other).number;
    }

    /**
     * @param {number} number
     */
    constructor(number) {
        super();

        /** @type {number} */
        this.number = Math.floor(number * 10000) / 10000;
    }

    getBackgroundColorAsResource() {
        return "#000000";
    }

    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} w
     * @param {number} h
     * @param {number} dpi
     */
    draw(canvas, context, w, h, dpi) {
        context.font = "bold " + h * 0.4 * dpi + "px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.strokeStyle = "#2e2f3a";
        context.lineWidth = 1.5 * dpi;
        context.strokeText(String(this.number), (w * dpi) / 2, (h * dpi) / 2);
        context.fillStyle = "#ffffff";
        context.fillText(String(this.number), (w * dpi) / 2, (h * dpi) / 2);
    }

    /**
     * Draws the item to a canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} size
     */
    drawFullSizeOnCanvas(context, size) {
        this.draw(null, context, size, size, 1);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {DrawParameters} parameters
     * @param {number=} diameter
     */
    drawItemCenteredImpl(x, y, parameters, diameter = 20) {
        const dpi = smoothenDpi(globalConfig["shapesSharpness"] * parameters.zoomLevel);
        if (!this.bufferGenerator) {
            this.bufferGenerator = this.draw.bind(this);
        }

        const width = diameter * 0.4 * dpi * String(this.number).length;
        const key = diameter + "/" + dpi + "/" + this.number;
        const canvas = parameters.root.buffers.getForKey({
            key: "numbers",
            subKey: key,
            w: width,
            h: diameter,
            dpi,
            redrawMethod: this.bufferGenerator,
        });
        parameters.context.drawImage(canvas, x - width / 2, y - diameter / 2 + 0.5, width, diameter);
    }
}
