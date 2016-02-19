'use strict';

describe('Pitch detector', function () {
  var util;

  beforeEach(module('pianoPitchDetector.util'));

  beforeEach(inject(function (utilService) {
    util = utilService;
  }));

  it('should extract frequency from key number.', function () {
    expect(util.getFrequencyFromKeyNum(1)).toBeCloseTo(27.5);

    expect(util.getFrequencyFromKeyNum(40)).toBeCloseTo(261.626);

    expect(util.getFrequencyFromKeyNum(70)).toBeCloseTo(1479.98);
  });
});

//# sourceMappingURL=util_test-compiled.js.map