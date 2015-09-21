var net = require('net');
var PropertiesReader =  require('properties-reader');
var properties = PropertiesReader('./app/config/database.file');

var host = properties.get('mongodb.main.host')
var port = properties.get('mongodb.main.port')
var dbname = properties.get('mongodb.main.dbname')
// Connection URL
var driver = 'mongodb://'+ host+':'+port+'/'+dbname;

var mongoose = require('mongoose');
//~ var conn = mongoose.connect( driver);
var conn = mongoose.createConnection( driver);
conn.on('error',console.error.bind(console,'连接错误:'));
conn.once('open',function(){
      //一次打开记录
});
var Schema = mongoose.Schema;
var waitQueue = require('./waitQueue')(Schema,conn);
var pop = function(){


}

var push = function(vaue){


}

var del = function(vaue){


}

var replce = function(vaue){


}



var gm_kf_map = require('./map/gm_kf');
var kf_wj_map = require('./map/kf_wj');

/**
  * map = { idx1:{ gm_id1:[ {kf_uid,ser_id}, {} ,{} ] },
  *		 idx2:{ },
  * }
  *
  *
  *
  */
var getIdxOfGmKfMap = function(gm_id){


}


/**
  * map = { idx1:{ kf_uid1:[ {wj_uid,gm_id,ser_id}, {} ,{} ] },
  *		 idx2:{ },
  * }
  *
  *
  *
  */
var getIdxOfKfWjMap = function(kf_uid){


}

module.exports = function(){

	net.createServer(function(socket) {
		// new connection
		socket.on('data', function(data) {
			// got data
		});
		socket.on('end', function(data) {
			// connection closed
		});
		socket.write('Some string');
	})
	.listen(3001);
	console.log("tcpserver linsten on 127.0.0.1:3001");

}
