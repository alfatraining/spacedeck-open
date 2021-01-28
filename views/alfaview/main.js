import Toolbar from "./Toolbar.vue";
import Shapes from "./Shapes.vue";
import Zones from "./Zones.vue";
import Background from "./Background.vue";
import ToolbarObject from "./ToolbarObject.vue";
import Color from "./Color.vue";
import TextStyles from "./TextStyles.vue";
import TextAlign from "./TextAlign.vue";
import Layout from "./Layout.vue";
import TextDigits from "./TextDigits.vue";
import ObjectOptions from "./ObjectOptions.vue";
import MinimapZoom from "./MinimapZoom.vue";
import BoardExpiration from "./BoardExpiration.vue";
import BoardMeta from "./BoardMeta.vue";
import Space from "./Space.vue";
import BoardError from "./BoardError.vue";

import VueI18n from "vue-i18n";
import en from "./locales/en";
import de from "./locales/de";
import { getBrowserLocale } from "./utils";

Vue.use(VueI18n);
const locales = {
  en: en,
  de: de,
};

Vue.config.lang = getBrowserLocale();
Vue.config.fallbackLang = "en";

Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang]);
});

Vue.component("Toolbar", Toolbar);
Vue.component("Shapes", Shapes);
Vue.component("Zones", Zones);
Vue.component("Background", Background);
Vue.component("ToolbarObject", ToolbarObject);
Vue.component("Color", Color);
Vue.component("TextStyles", TextStyles);
Vue.component("TextAlign", TextAlign);
Vue.component("Layout", Layout);
Vue.component("TextDigits", TextDigits);
Vue.component("ObjectOptions", ObjectOptions);
Vue.component("MinimapZoom", MinimapZoom);
Vue.component("BoardExpiration", BoardExpiration);
Vue.component("BoardMeta", BoardMeta);
Vue.component("Space", Space);
Vue.component("BoardError", BoardError);
