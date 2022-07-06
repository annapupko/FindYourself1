const images = {
  logo: require('../../assests/img/logo_1.png'),
};
export const getImage = name => {
  if (name in images) {
    return images[name];
  }
};
