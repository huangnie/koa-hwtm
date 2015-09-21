var cu_datetime = require('./plugins/datetime');
module.exports = function(Schema,db){

	var ObjectId = Schema.ObjectId;

	var table = {
		model	: { type: String, require: true },
		field	: { type: String, require: true },
		seq 	: { type: Number, default:  1   }
    }

	var IdCounterSchema = new Schema(table);

	IdCounterSchema.plugin(cu_datetime,{index:true});

	IdCounterSchema.static.nextId = function(){

		return 2222;
	}

	// a setter
	IdCounterSchema.path('model').set(function (v) {
		//~ return capitalize(v);
		return v;
	});


	IdCounterSchema.pre('set', function (next) {

		next();
	});

	return db.model('id_counter',IdCounterSchema);
}
