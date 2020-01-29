"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom = __importStar(require("@hapi/boom"));
const utils = __importStar(require("../utils"));
exports.asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
        if (!e.isBoom)
            return next(boom.badImplementation(e));
        next(e);
    });
};
exports.log = (e, _, __, next) => {
    console.error(e);
    next(e);
};
exports.notify = (e, _, __, next) => {
    utils.notifyError(e);
    next(e);
};
exports.handler = (e, _, res, __) => {
    return res.status(e.output.statusCode).json(e.output.payload);
};
//# sourceMappingURL=error.js.map