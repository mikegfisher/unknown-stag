import './polyfill.js'

it('Object.values is valid', () => {
  Object.values({foo:"bar"}) == "bar";
});
