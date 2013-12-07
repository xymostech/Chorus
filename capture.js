var pcap = require('pcap'),
	tcp_tracker = new pcap.TCP_tracker(),
	pcap_session = pcap.createSession('', "ip proto \\tcp");
var events = require('events');
//Chorus objects to be emmitted
function chorus_obj() {
	
}
//Session objects, event emmitter
function session_obj() { }
session_obj.prototype.__proto__ = events.EventEmitter.prototype;

var capture = new session_obj();

/*tcp_tracker.on('start', function (session) {
	//console.log('START: ' + session.src_name + '->' + session.dst_name);
	
});
tcp_tracker.on('end', function (session) {
	//console.log('END: ' + session.src_name + '->' + session.dst_name);
	console.log(JSON.stringify(session));
});
tcp_tracker.on('http error', function (session) {
	
});*/


pcap_session.on('packet', function (raw_packet) {
	var packet = pcap.decode.packet(raw_packet);
	capture.emit('capture', packet);
	//tcp_tracker.track_packet(packet);
});

module.exports = capture;
