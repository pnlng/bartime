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