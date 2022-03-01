import { globalConfig } from "shapez/core/config";
import { enumColors } from "shapez/game/colors";
import { Entity } from "shapez/game/entity";
import { HUDConstantSignalEdit } from "shapez/game/hud/parts/constant_signal_edit";
import { COLOR_ITEM_SINGLETONS } from "shapez/game/items/color_item";
import { DisplaySystem } from "shapez/game/systems/display";
import { Mod } from "shapez/mods/mod";
import { NumberItem } from "./item";
import { NumberManager } from "./numberManager";

const e = 2.7182;
const pi = 3.1415;

class ModImpl extends Mod {
    init() {
        const numberManager = new NumberManager();
        globalConfig["numberManager"] = numberManager;

        this.modInterface.registerItem(NumberItem, itemData => numberManager.getItem(itemData));

        this.modInterface.replaceMethod(
            HUDConstantSignalEdit,
            "parseSignalCode",
            function ($original, [entity, code]) {
                if (code == "e") {
                    return numberManager.getItem(e);
                } else if (code == "pi") {
                    return numberManager.getItem(pi);
                }

                const number = Number(code);
                if (!isNaN(number)) {
                    return numberManager.getItem(number);
                }

                const result = $original(entity, code);
                if (result) {
                    return result;
                }

                return null;
            }
        );

        this.modInterface.replaceMethod(DisplaySystem, "getDisplayItem", function ($original, [value]) {
            if (!value) {
                return null;
            }

            if (value.getItemType() === "number") {
                return COLOR_ITEM_SINGLETONS[enumColors.white];
            }

            return $original(value);
        });
    }
}
