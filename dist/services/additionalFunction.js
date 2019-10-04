"use strict";

exports.htmlspecialchars = function (text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
};

exports.nulltozero = function (data) {
  if (data === null || data === "") {
    return 0;
  } else {
    return data;
  }
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

exports.getRandom = function () {
  return getRandomArbitrary(3, 13).toFixed(0);
};