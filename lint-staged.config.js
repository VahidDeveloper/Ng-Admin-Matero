module.exports = {
  '*.ts': filenames => filenames.map(file => `npx eslint --fix "${file}"`),
  '*.scss': filenames => filenames.map(file => `npx stylelint --fix "${file}"`),
  '*.{ts,scss,html,css,js,json,md,yml}': filenames =>
    filenames.map(file => `npx prettier --write "${file}"`),
};
