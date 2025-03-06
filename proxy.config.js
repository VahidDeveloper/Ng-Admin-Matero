const PROXY_CONFIG = {
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
