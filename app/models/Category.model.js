var cu_datetime = require('./plugins/datetime');
//var autoinc = require('./plugins/autoIncreaseId');
module.exports = function(Schema,db,idCounterModel){

	var ObjectId = Schema.Types.ObjectId;

	var table = {
 		manager_id  : {type:String,default:''},
 		customer_id : {type:String,default:''},
 		name     	: {type:String,default:''},
		icon      	: {type:String,default:''},
		parent_id	: {type:String,default:''},
		remark      : {type:String,default:''},
		view      	: {type:Boolean,default:true}  	// 是否可见
	}

	var CategorySchema = new Schema(table);
	CategorySchema.plugin(cu_datetime,{index:true});

	//CategorySchema.plugin(autoinc,{ counterModel : idCounterModel , schemaName: 'category', field: 'id', start: 0, step: 1 });

	// a setter
	CategorySchema.path('name').set(function (v) {
	  //return capitalize(v);
	  return v;
	});

	// middleware
	CategorySchema.pre('save', function (next) {
	  //notify(this.get('email'));
	  next();
	});

	return  db.model('category',CategorySchema);
}
