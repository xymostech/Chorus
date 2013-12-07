var sound = require('./sound'), capture = require('./capture');
var os = require('os'), ifaces = os.networkInterfaces();

var local_ip = ifaces[capture.pcap_session.device_name][0].address;

var currTime = 0;
var count = 0;

function TimeCounter(time_length) {
    this.events = [];

    this.time_length = time_length;
}

TimeCounter.prototype.add_event = function(num) {
    this.events.push({num: num, time: Date.now()});
};

TimeCounter.prototype.check = function() {
    var now = Date.now() - this.time_length * 1000;
    for (var i = 0; i < this.events.length; i++) {
        if (this.events[i].time >= now) {
            break;
        }
    }
    this.events = this.events.slice(i);
};

TimeCounter.prototype.total = function() {
    var total = 0;
    for (var i = 0; i < this.events.length; i++) {
        total += this.events[i].num;
    }
    return total;
};

var chords = [
    [-1, -8/12, -5/12, 0, 4/12, 7/12, 1],
    [-9/12, -6/12, -2/12, 3/12, 6/12, 10/12, 15/12]
];
var curr_sounds = chords[0];

var limit_counter = new TimeCounter(0.3);
var inbound_counter = new TimeCounter(5);
var outbound_counter = new TimeCounter(5);

setInterval(function() {
    inbound_counter.check();
    outbound_counter.check();

    if (inbound_counter.total() > outbound_counter.total()) {
        curr_sounds = chords[0];
    } else {
        curr_sounds = chords[1];
    }
}, 10);

function convert_to_sound(packet) {
    var port = packet.link.ip.tcp.dport;
    var inbound = packet.link.ip.daddr == local_ip;
    var length = packet.link.ip.total_length;
    var checksum = packet.link.ip.tcp.checksum;

    if (inbound) {
        inbound_counter.add_event(length);
    } else {
        outbound_counter.add_event(length);
    }

    limit_counter.check();
    if (limit_counter.total() > 1) {
        return;
    }
    limit_counter.add_event(1);

    var sound_length = Math.log(length) / Math.log(8);
    var max_vol = Math.log(length) / Math.log(65535);
    var rate = (inbound ? 1 : -1) * max_vol / sound_length;

    var freq = curr_sounds[checksum % curr_sounds.length];

    sound.add_sound(freq, max_vol, rate);
}

capture.on('capture', convert_to_sound);

sound.run();
