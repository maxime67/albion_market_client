import api from './api';

export default {
    test() {
        return api.get('prices/T6_ARMOR_LEATHER_FEY@4?locations=Caerleon,Bridgewatch,Thetford,Lymhurst');
    },
};