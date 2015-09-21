
module.exports = exports = function(cellection,options){

	var start = options.start || 0;
	var step =  options.step || 1;
	var schemaName =  options.schemaName || 'modelkey'
	var autocreaseField = options.field || 'id';
	var counterModel = options.counterModel;

	var fields = {},
        ready  = false;

	fields[autocreaseField] = {
		type:    Number,
		unique:  true,
		require: true
    };
    cellection.add(fields);

    // Initializing of plugin
    counterModel.findOne({
      model: schemaName,
      field: autocreaseField
    }, function (err, res) {
      if (!res)
        (new counterModel({
          model: schemaName,
          field: autocreaseField,
          seq:   start
        })).save(function () {
          ready = true;
        });
      else
        ready = true;
    });


	// middleware
	cellection.pre('save', function (next) {
		this[autocreaseField] = 0;
		var doc=this;

		function save(){

			if(ready){

				counterModel.collection.findAndModify({
					model: schemaName,
					field: autocreaseField,
				  }, [], {
					$inc: {
					  seq: step
					}
				  }, {
					'new':  true,
					upsert: true
				  }, function (err, res) {
					console.log(res);
					if (!err)


					  console.log(doc);
					next(err);
				  });

			}else{
				setTimeout(save,5)
			}
		}

		save();
	})


}
