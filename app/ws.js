var PropertiesReader =  require('properties-reader');
var databaseConfig = PropertiesReader('./config/database.conf');
var host = databaseConfig.get('mongodb.main.host');
var port = databaseConfig.get('mongodb.main.port');
var dbname = databaseConfig.get('mongodb.main.dbname');
// Connection URL
var driver = 'mongodb://'+ host+':'+port+'/'+dbname;

var mongoose = require('mongoose');
//~ var Conn = mongoose.Connect( driver);
var Conn = mongoose.createConnection( driver);
//autoinc.init(Conn);

Conn.on('error',console.error.bind(console,'连接错误:'));
Conn.once('open',function(){
      //一次打开记录
});
var Schema = mongoose.Schema;


var idCounterModel = require('./models/IdCounter.model')(Schema,Conn);

var Models = {};



var sockets = { };
var users = { }
var member_list = {}

var randomName =function(){
	var arr = "甄博雅 禄锐思 古伟奇 蓝翰采 孙向明 乐烨霖 扶辰逸 柏博厚 平建业 戚承颜 时嘉歆 陆天材 权兴德 尹宏恺 壤驷鸿志 全飞驰 桓鸿博 公向笛 柯绍祺 皇甫斯年 巫马咏歌 鲁涵忍 乐正嘉志 束修筠 裴兴生 佘佴天路 鱼正初 巴正志 岑志业 秋鸿达 端木文滨 殴志尚 蔡才艺 曾德业 洪飞鸿 夏修雅 东郭阳晖 居新知 解弘盛 聂咏思 张弘济 姜文星 上官星津 蓝涵忍 拓拔雅达 甄伟奇 宰父力学 钟文翰".split( ' ');
 	var len = arr.length;
	var num = Math.floor(Math.random()*(len-1));
	return arr[num];
}

var base64_decode =function (str){
	var str = new Buffer(str,'base64');
	return str.toString();
}



var API = require('./websocket/class');
module.exports = function(io){

 	var keepliveTimer = null;					// 句柄
	var maxLeaveTime  = 300 * 1000;				// 最大离线时间长度（秒）
	var heartInterval = 60 * 1000;  			// 心跳时间间隔
	var maxDeltaDiff  = 2  * 1000;              // 监控回复

	var model = function(modelName,namespace){
		var namespace = namespace ? namespace+'/' : '';
		if(!Models[modelName]) {
			Models[modelName] = require('./models/' + namespace + modelName + '.model')(Schema,Conn,idCounterModel);
		}
		return  Models[modelName];
	}

	var updateUserStatus = function(user_id){
		member_list[user_id].update_at = (new Date()).getTime();
		return member_list[user_id].update_at;
	}

	var isUserLeave = function(user_id){
		if(typeof member_list[user_id] == 'undefined') return true;
		else if((member_list[user_id].update_at + maxLeaveTime) < (new Date()).getTime()){
			return true;
		}
		else return false;
	}

	var socketQueueCechWorker = function() {
		for(var user_id in users) {
			var socket_id = users[user_id].socket_id;
			var curTime = (new Date()).getTime();
			var diff = curTime - member_list[user_id].update_at;
			if(diff > maxLeaveTime){
				console.log('tip ['+ curTime/1000+']: 用户（'+ user_id +'）已下线了');
				delete sockets[socket_id];
			}else if(diff > heartInterval){
				var data = {timestamp: curTime,type:'ask', msg: 'are you  still alive ?'};
				sockets[socket_id].socket.emit('heart', data);
				console.log('send heart[ ask @ '+ curTime/1000+']: ' + data.msg );
			} else {
				updateUserStatus(user_id);
			}
		}
		setTimeout(socketQueueCechWorker, heartInterval);
		console.log('----  监测了一轮[ 每间隔 '+ (heartInterval/1000) +' 秒一轮] @ '+(new Date().toString())+' ------');
	}
	// 开启监控
	socketQueueCechWorker();

	io.on('connection', function(socket){
		socket.emit('hello', 'it is great, you are connected success');

		//***********************//  用户在线状态监控(heart)，服务端与客户端的监控方式不一样，要监控所有用户  //******************************//

		socket.on('heart', function (data) {
			var user_id = sockets[socket.id].user_id
			var curTime = updateUserStatus(user_id);
			console.log('recieve heart[ ask @ '+curTime/1000+']:  ' + data.msg);
		});


		// 用户登录
		socket.on('login', function (loginUser) {

			if(!loginUser.type || (loginUser.type != 'customer' && loginUser.type != 'customer')){
				socket.emit('close', '你还未登录，请求参数有误,认证失败,关闭了连接');
				delete socket;
			}else{
				if(loginUser.type == 'customer'){
					var userModel = model('User/CustomerInfo')
				}else if(loginUser.type == 'manager'){
					var userModel = model('User/ManagerInfo')
				}

				userModel.findOne({email: loginUser.email},function(err,user){
					if(!user){
						socket.emit('close', '改用户不存在,关闭了连接');
						delete socket;
					}else if( user.password == base64_decode(loginUser.password)){

						var user_id = loginUser._id;
						if(!isUserLeave(loginUser._id)){
							// 之前未离线，只是刷新或到其他地方登陆
							// 释放资源

							var oldSocketId = users[user_id];
							delete sockets[oldSocketId];
							// 更新关联
							sockets[socket.id] = {
								user_id: user._id,
								socket: socket,
							}
							users[user_id] = {
								password: user.password,
								socket_id: socket.id,
							}
							var datetime = updateUserStatus(user_id);

							var msg = {
								to_user_id :user_id,
								dialog_id :user_id,
								from_user_id : 'sys',
								content : user.name  + ' 已重新登陆了',
								type:'free',
								datetime : datetime
							}

							socket.emit('free', msg);
							socket.emit('member_list',member_list);
						}else{
							// 从未登陆过,或之前已离线，现在重新登陆
							var datetime = (new Date()).getTime()
							member_list[user_id] = {
								create_at: datetime,
								update_at: datetime,
								user : {
									_id: user._id,
									name: user.name,
									email: user.email,
									icon: user.icon || '/img/chat/head/defalut.jpg',
									tel: user.tel,
									type: 'customer'
								}
							};
							users[user_id] = {
								password: user.password,
								socket_id: socket.id,
							}
							sockets[socket.id] = {
								user_id: user._id,
								socket: socket,
							}

							var msg = {
								to_user_id : 'all',
								from_user_id : 'sys',
								content : user.name  + ' 上线了，大家欢迎！',
								dialog_id:'free',
								datetime : datetime
							}
							io.sockets.emit('member_list',member_list);
							io.sockets.emit('success', '祝你使用愉快!');
							io.sockets.emit('free', msg);
						}

					}else{

						socket.emit('close', '认证失败,关闭了连接');
						delete socket;
					}
				})

			}

		});


		//***********************// 后面是业务逻辑部分（business）   //******************************//
		socket.on('message', function (data) {
			io.sockets.send(data);
			socket.broadcast.emit('广播');
		});


		// 公聊消息
		socket.on('free', function (msg) {
			console.log('recive:');
			console.log(msg);
			var user_id = msg.from_user_id;
			var curTime = updateUserStatus(user_id);
			// 业务可写在这里
			// code here


			// 广播消息给其他
			io.sockets.emit('free', msg);
			console.log('send:');
			console.log(msg);
			io.sockets.emit('member_list',member_list);  // 大群的人员变动很频繁，客户端需要实时更新人员列表
			//socket.broadcast.emit(data);
		});

		// 私聊消息
		socket.on('secret', function (msg) {

			console.log('recive:');
			console.log(msg);
			var user_id = msg.from_user_id;
			var curTime = updateUserStatus(user_id);
			// 业务可写在这里
			// code here

			// 定向转发消息
			if(!isUserLeave(msg.to_user_id)) {

				var secretDialogModel = model('Chat/SecretDialog')
				var data = {
					from_user:{_id : msg.from_user_id},
					to_user: {_id : msg.to_user_id}
				}

				secretDialogModel.findOne(data, function(err,dialog){

				console.log(err)
				console.log(dialog)

					if(dialog){
						secretDialogModel.update(data, {$set: {view:true}},function(err,res){ })
					}else{
						secretDialogModel.create(data,function(err,res){})
					}
				})

				console.log('send:');
				console.log(msg);
				var socket_id = users[msg.to_user_id].socket_id
				var to_socket = sockets[socket_id].socket;
				to_socket.emit('secret', msg);
			}
			else{
				var leave_user_id = msg.to_user_id;
				msg['dialog_id']= msg.to_user_id;
				msg.to_user_id = msg.from_user_id;
				msg.from_user_id = 'sys';
				msg.content =  member_list[leave_user_id].user.name + ' 已离开，消息发送失败！';
				msg.datetime =  new Date().toString();

				console.log('send:');
				console.log(msg);
				socket.emit('secret',  msg);
			}

		});

		// 讨论组消息
		socket.on('discuss', function (msg) {
			console.log('recive:');
			console.log(msg);
			var user_id = msg.from_user_id;
			var curTime = updateUserStatus(user_id);
			// 业务可写在这里
			// code here


			// 转发消息给其他
			var socket = sockets[msg.to_user_id];
			if(!isUserLeave(msg.to_user_id)) {
				var socketId = users[msg.to_user_id].socket_id;
				sockets[socketId].socket.emit('discuss', data);
			}
			else{
				msg['dialog_id']= msg.to_user_id;

				msg.to_user_id = user_id;
				msg.from_user_id = 'sys';
				msg.content =  member_list[user_id].user.name + ' 已离开，消息发送失败！'

				console.log('send:');
				console.log(msg);
				socket.emit('discuss',  msg);
			}

			io.sockets.emit('member_list',member_list);
			//socket.broadcast.emit(data);
		});


		// 客户端断开
		socket.on('disconnect', function (data) {  // close 时 也是到这里

			if(sockets[socket.id]){
				var user_id = sockets[socket.id].user_id;

				if(isUserLeave(user_id)){
					var name = member_list[user_id].user.name;
					delete sockets[socket.id];
					delete users[user_id];
					delete member_list[user_id];

					var msg = {
						from_user_id: user_id,
						to_user_id: 'all',
						content : ' 我已离线，无需留恋！',
						type:'close',
						dialog_id:'free',
						datetime : new Date.toString()
					}

					// 向公聊的群通知
					io.sockets.emit('free', msg);
					io.sockets.emit('member_list',member_list);

					var secretDialogModel = model('Chat/SecretDialog')
					var msg = {
						from_user_id:'sys',
						to_user_id: 'all',
						content : msg.to_user.name  + ' 已下线，消息发送失败！',
						dialog_id:'free',
						datetime : new Date.toString()
					}
					// 作为私聊发起人 离线
					secretDialogModel.find({from_user:{_id : user_id}}, function(err,dialogs){
						if(dialogs){
							secretDialogModel.update(data, {$set: {view:false}},function(err,res){
								for(var i in dialogs){
									var to_user_id = dialogs[i].to_use_id;
									var socketId = users[to_user_id].socket_id;
									msg.dialog_id = to_user_id;
									msg.to_user_id = to_user_id;
									sockets[socketId].socket.emit('secret',msg);
								}
							})
						}else{
							// 无发起的私聊
						}
					})

					// 作为私聊接收人 离线
					secretDialogModel.find({to_user:{_id : user_id}}, function(err,dialogs){
						if(dialogs){
							secretDialogModel.update({to_user:{_id : user_id}}, {$set: {view:false}},function(err,res){
								for(var i in dialogs){
									var from_user_id = dialogs[i].from_use_id;
									var socketId = users[from_user_id].socket_id;
									msg.dialog_id = from_user_id;
									msg.to_user_id = from_user_id;
									sockets[socketId].socket.emit('secret',msg);
								}
							})
						}else{
							// 无接收的私聊
						}
					})

					/*****       讨论组，要区分用户离线、在线、退出、加入等情况           *****/

					var discussDialogModel = model('Chat/DiscussDialog')
					// 作为讨论组发起人 离线
					secretDialogModel.find({from_user:{_id : user_id}}, function(err,dialogs){
						if(dialogs){
							// 以后在处理这里
						}else{
							// 无发起的讨论组
						}
					})

					// 作为讨论组参与人 离线
					var query = secretDialogModel.where('member').in([user_id]);
					query.exec(function(err,dialogs){
						if(dialogs){
							// 以后在处理这里
						}else{
							// 无接收的讨论组
						}
					})

					// 业务代码可写这里
					// code here
				}
			}


		});


		// socket.set 方法分为用于设置变量
		socket.on('set nickname', function (name) {
			socket.set('nickname', name, function () {
				socket.emit('ready');
			});
		});

		// socket.get方法分为用于获取变量
		socket.on('get nickname', function () {
			socket.get('nickname', function (err, name) {
				console.log('Chat message by ', name);
			});
		});


	});

}
