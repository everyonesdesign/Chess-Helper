import jsDomGlobal from 'jsdom-global';
import assert from 'assert';

jsDomGlobal();

const {
  i18n,
} = require('../src/i18n');

describe('Language modules', function() {
  describe('i18n', function() {
    it('translates simple strings', function() {
      const result = i18n('_test', {}, 'en');
      assert.equal(result, 'Test content');
    });

    it('substibutes 1 placeholder', function() {
      const result = i18n('_test_1_placeholder', { name1: 'p1' }, 'en');
      assert.equal(result, 'Test content p1');
    });

    it('substibutes 2 placeholders', function() {
      const result = i18n('_test_2_placeholders', { name1: 'p1', name2: 'p2' }, 'en');
      assert.equal(result, 'Test content p1 p2');
    });
  });
});
