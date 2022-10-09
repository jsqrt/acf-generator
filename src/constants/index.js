import { getRandomKey } from "../utils";

export const initialStore = {
  fieldsData: [],
  settings: {
    ignoreClasses: [
      'list',
      'swiper-wrapper',
      'item',
      'slider',
    ],
    allowedTypes: {
      pictures: true,
      images: true,
      text: true,
      icons: true,
      links: true,
      buttons: true,
    },
    sectionsPreset: {},
  },
  currentPageKey: undefined,
  fieldKeyCounter: getRandomKey(),
  pictureBrickFieldKey: getRandomKey(),
};