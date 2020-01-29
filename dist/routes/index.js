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
const express_1 = __importDefault(require("express"));
const ctrl = __importStar(require("../controllers"));
const error = __importStar(require("../middleware/error"));
const router = express_1.default.Router();
router.get('/start/:time', error.asyncWrapper(ctrl.start));
router.get('/pause', error.asyncWrapper(ctrl.pause));
router.get('/resume', error.asyncWrapper(ctrl.resume));
router.get('/stop', error.asyncWrapper(ctrl.stop));
router.get('/toggle', error.asyncWrapper(ctrl.toggle));
router.get('/default-text', error.asyncWrapper(ctrl.getDefaultText));
router.get('/config', error.asyncWrapper(ctrl.getConfig));
router.get('/config/set', error.asyncWrapper(ctrl.setConfig));
exports.default = router;
//# sourceMappingURL=index.js.map