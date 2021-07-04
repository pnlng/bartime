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
exports.Timer = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const BarTimer_1 = __importDefault(require("./models/BarTimer"));
const config_1 = __importDefault(require("./utils/config"));
const error = __importStar(require("./middleware/error"));
const startServer = (server) => {
    const port = config_1.default.get('port');
    server.listen(port);
    console.log(`Server running on port ${port}`);
};
const server = express_1.default();
server.use('/bartime', routes_1.default);
server.use(error.log);
server.use(error.notify);
server.use(error.handler);
startServer(server);
exports.Timer = new BarTimer_1.default();
exports.default = server;
//# sourceMappingURL=server.js.map