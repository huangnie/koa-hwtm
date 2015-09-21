var cu_datetime = require('./plugins/datetime');
//var autoinc = require('./plugins/autoIncreaseId');
module.exports = function(Schema,db,idCounterModel){

	var ObjectId = Schema.Types.ObjectId;

	var table = {
		name	  : {type:String,default:''},
 		option    : {type:String,default:''},
		value     : {type:String,default:''},
		icon      : {type:String,default:''}, 		// 图标
		view      : {type:Boolean,default:true}  	// 是否可见
 	}

	var SettingSchema = new Schema(table);

	SettingSchema.plugin(cu_datetime,{index:true});

	//SettingSchema.plugin(autoinc,{ counterModel : idCounterModel , schemaName: 'setting', field: 'id', start: 0, step: 1 });


	// a setter
	SettingSchema.path('photo').set(function (v) {
		//~ return capitalize(v);
		return v;
	});



	SettingSchema.pre('set', function (next) {

		next();
	});

	return db.model('setting',SettingSchema);
}

