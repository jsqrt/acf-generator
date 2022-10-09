export const initialStore = {
  fieldsData: [],
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
  sectionsPreset: [],
  fieldKeyCounter: Math.floor(Math.random() * (9999999999999 - 1111111111111)) + 1111111111111,
  pictureBrickFieldKey: Math.floor(Math.random() * (9999999999999 - 1111111111111)) + 1111111111111,
};