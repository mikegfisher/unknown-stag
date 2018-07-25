import './polyfill.js'

test('Object.values is valid', () => {
  Object.values({foo:"bar"}) == "bar";
});
