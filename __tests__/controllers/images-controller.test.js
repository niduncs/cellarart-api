const ImagesController = require('../../app/controllers/images-controller');
let imagesController = null;

beforeAll(() => {
  imagesController = new ImagesController('s3cr3t', knex);
});

it('tests constructor', () => {
  expect(imagesController).toBeInstanceOf(ImagesController);
});

it('tests all methods exist', () => {
  expect(imagesController).toHaveProperty('getImages');
  expect(imagesController).toHaveProperty('deleteImages');
  expect(imagesController).toHaveProperty('addImage');
});
