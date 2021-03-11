import { toPng } from 'html-to-image';
import download from 'downloadjs';
import dayjs from 'dayjs';

const browserDetectedLang = () => {
  return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
};

// initialize to German locale if it's any of the variations, otherwise fall back to English
export const getBrowserLocale = () => {
  return ['de', 'de-DE', 'de-CH', 'de-AT', 'de-LU', 'de-LI'].indexOf(browserDetectedLang()) > -1 ? 'de' : 'en';
};

export const downloadSpace = (spaceWidth, spaceHeight) => {
  return toPng(document.getElementById('space'), {
    width: spaceWidth,
    height: spaceHeight,
  }).then(function (dataUrl) {
    download(dataUrl, `whiteboard-${dayjs().format('DD-MM-YYYY')}.png`);
  });
};
