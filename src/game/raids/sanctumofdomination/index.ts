/* eslint-disable @typescript-eslint/no-var-requires */
import SanctumOfDomination from './images/sanctumofdomination.jpg';

export default {
  name: 'Sanctum of Domination', // T27
  background: SanctumOfDomination,
  bosses: {
    TheTarragrue: require('./TheTarragrue').default, // 1
    EyeOfTheJailer: require('./EyeOfTheJailer').default, // 2
    TheNine: require('./TheNine').default, // 3
    RemnantOfNerzhul: require('./RemnantOfNerzhul').default, // 4
    SoulrenderDormazain: require('./SoulrenderDormazain').default, // 5
    PainsmithRaznal: require('./PainsmithRaznal').default, // 6
    GuardianOfTheFirstOnes: require('./GuardianOfTheFirstOnes').default, // 7
    FatescribeRohKalo: require('./FatescribeRohKalo').default, // 8
    KelThuzad: require('./KelThuzad').default, // 9
    SylvanasWindrunner: require('./SylvanasWindrunner').default, // 10
  },
};
