"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const icons = __importStar(require("../assets/icons"));
const boom = __importStar(require("@hapi/boom"));
const open_1 = __importDefault(require("open"));
require("url-search-params-polyfill");
exports.sendToBTT = async ({ text, iconData }) => {
    const uuid = config_1.default.get('uuid');
    const bttSecret = config_1.default.get('bttSecret');
    const baseUrl = 'btt://update_touch_bar_widget/';
    const searchParams = new URLSearchParams([['uuid', uuid], ['sharedSecret', bttSecret]]);
    if (text) {
        searchParams.append('text', text);
    }
    if (iconData) {
        searchParams.append('icon_data', iconData);
    }
    const url = `${baseUrl}?${searchParams.toString()}`;
    try {
        return await open_1.default(url, { background: true, wait: false });
    }
    catch (e) {
        throw boom.badRequest(`Please install BetterTouchTool properly, or disable BarTime's BTT integration. `);
    }
};
exports.resetBTT = async () => {
    const bttDefaultText = config_1.default.get('defaultText');
    return await exports.sendToBTT({ text: bttDefaultText, iconData: icons.defaultIcon });
};
//# sourceMappingURL=btt.js.map