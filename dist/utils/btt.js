"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetBTT = exports.sendToBTT = void 0;
const config_1 = __importDefault(require("./config"));
const icons = __importStar(require("../assets/icons"));
const boom = __importStar(require("@hapi/boom"));
const open_1 = __importDefault(require("open"));
const sendToBTT = async ({ text, iconData }) => {
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
exports.sendToBTT = sendToBTT;
const resetBTT = async () => {
    const bttDefaultText = config_1.default.get('defaultText');
    return await exports.sendToBTT({ text: bttDefaultText, iconData: icons.defaultIcon });
};
exports.resetBTT = resetBTT;
//# sourceMappingURL=btt.js.map