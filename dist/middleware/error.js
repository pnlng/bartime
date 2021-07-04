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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.notify = exports.log = exports.asyncWrapper = void 0;
const boom = __importStar(require("@hapi/boom"));
const utils = __importStar(require("../utils"));
const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
        if (!e.isBoom)
            return next(boom.badImplementation(e));
        next(e);
    });
};
exports.asyncWrapper = asyncWrapper;
const log = (e, _, __, next) => {
    console.error(e);
    next(e);
};
exports.log = log;
const notify = (e, _, __, next) => {
    utils.notifyError(e);
    next(e);
};
exports.notify = notify;
const handler = (e, _, res, __) => {
    return res.status(e.output.statusCode).json(e.output.payload);
};
exports.handler = handler;
//# sourceMappingURL=error.js.map