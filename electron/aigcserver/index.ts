import {ServerCosyvoice} from "./server-cosyvoice";
import {ServerMuseTalk} from "./server-MuseTalk";
import {ServerCosyvoice205b} from "./server-cosyvoice2-0.5b";
import {ServerCosyvoice2300mInstruct} from "./server-cosyvoice2-300m-instruct";
import {EasyServer} from "./EasyServer";


export const AigcServer = {
    'EasyServer': EasyServer,
    'server-cosyvoice': ServerCosyvoice,
    'server-MuseTalk': ServerMuseTalk,
    'server-cosyvoice2-0.5b': ServerCosyvoice205b,
    'server-cosyvoice2-300m-instruct': ServerCosyvoice2300mInstruct,
}
