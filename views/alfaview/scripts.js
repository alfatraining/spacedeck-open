import constants from 'common/constants';
import jsCookie from 'js-cookie';

window.constants = constants;
window.jsCookie = jsCookie;

if (ENV.environment === 'production') {
  console.log = function () {};
}
