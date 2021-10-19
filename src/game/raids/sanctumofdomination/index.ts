/* eslint-disable @typescript-eslint/no-var-requires */
import SanctumOfDomination from './images/sanctumofdomination.jpg';

export default {
  name: 'Sanctum of Domination', // T27
  background: SanctumOfDomination,
  bosses: {},
  TheTarragrue: require('./TheTarragrue').default, // 1
  EyeOfTheJailer: require('./EyeOfTheJailer').default, // 2
  TheNine: require('./TheNine').default, // 3
  RemnantOfNerzhul: require('./RemnantOfNerzhul').default, // 4
};
