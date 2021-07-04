"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const conf_1 = __importDefault(require("conf"));
exports.schema = {
    uuid: {
        type: 'string',
        default: ''
    },
    bttSecret: {
        type: 'string',
        default: ''
    },
    port: {
        type: 'number',
        default: parseInt(process.env.PORT) || 4975,
        minimum: 1,
        maximum: 65535
    },
    barLength: {
        type: 'number',
        minimum: 1,
        default: 10
    },
    useBtt: {
        type: 'boolean',
        default: true
    },
    notify: {
        type: 'boolean',
        default: true
    },
    notifySound: {
        type: ['string', 'boolean'],
        default: true
    },
    defaultText: {
        type: 'string',
        default: '15m'
    },
    defaultDuration: {
        type: 'string',
        default: '15m'
    },
    refreshRate: {
        type: 'number',
        default: 10
    }
};
const config = new conf_1.default({ schema: exports.schema, projectName: 'bartime' });
exports.default = config;
//# sourceMappingURL=config.js.map