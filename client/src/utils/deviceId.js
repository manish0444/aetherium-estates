export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

const generateDeviceId = () => {
  const nav = window.navigator;
  const screen = window.screen;
  const guid = nav.mimeTypes.length;
  return btoa(`${nav.userAgent}${screen.height}${screen.width}${guid}${Date.now()}${Math.random()}`);
}; 