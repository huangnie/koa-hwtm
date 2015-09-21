
module.exports = function(Schema,db){

	var ObjectId = Schema.ObjectId;

	var table = {
		wj_uid      : {type:Number,default:0},
		ser_id      : {type:Number,default:0},
        gm_id 		: {type:Number,default:0},
		start      	: {type:Date,default:Date.now}, // 入队时间
		last      	: {type:Date,default:Date.now}  // 上次检测在线时间
	}

	var WjWaitStatisticSchema = new Schema(table);

	// a setter
	var WaitQueueSchema.path('name').set(function (v) {
	  //return capitalize(v);
	});

	// middleware
	WaitQueueSchema.pre('save', function (next) {
	  //notify(this.get('email'));
	  next();
	});
	WaitQueueSchema.pre('set', function (next) {

	  next();
	});

	return = db.model('WaitQueue',WaitQueueSchema);
}






