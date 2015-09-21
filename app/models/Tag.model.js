var cu_datetime = require('./plugins/datetime');
//var autoinc = require('./plugins/autoIncreaseId');
module.exports = function(Schema,db,idCounterModel){

	var ObjectId = Schema.Types.ObjectId;

	var table = {
		name     : {type:String,default:0},
		icon     : {type:String,default:0},
		remark   : {type:String,default:0}, 		// 备注
		view     : {type:Boolean,default:true}  	// 是否可见
	}

	var TagSchema = new Schema(table);
	TagSchema.plugin(cu_datetime,{index:true});

	//TagSchema.plugin(autoinc,{ counterModel : idCounterModel , schemaName: 'tag', field: 'id', start: 0, step: 1 });

	// a setter
	TagSchema.path('name').set(function (v) {
	  //return capitalize(v);
	  return v;
	});

	// middleware
	TagSchema.pre('save', function (next) {
	  //notify(this.get('email'));
	  next();
	});
	TagSchema.pre('set', function (next) {

	  next();
	});

	return  db.model('tag',TagSchema);
}
