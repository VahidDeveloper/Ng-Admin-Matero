// https://angular.io/guide/build#proxying-to-a-backend-server

const PROXY_CONFIG = {
  '/users/**': {
    target: 'https://api.github.com',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    // onProxyReq: (proxyReq, req, res) => {
    //   const cookieMap = {
    //     SID: '',
    //   };
    //   let cookie = '';
    //   for (const key of Object.keys(cookieMap)) {
    //     cookie += `${key}=${cookieMap[key]}; `;
    //   }
    //   proxyReq.setHeader('cookie', cookie);
    // },
  },
  '/rest/**': {
    target: 'https://wina-develop.phoenix.mahsan.net',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  },
  '/api/**': {
    target: 'https://wina-develop.phoenix.mahsan.net',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  },
};

module.exports = PROXY_CONFIG;
