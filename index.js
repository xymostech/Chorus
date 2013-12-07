var sound = require('sound'), capture = require('capture');

capture.on('capture', sound.addSound);
