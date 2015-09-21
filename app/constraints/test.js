// app/constraints/api.js
module.exports = {

  index: function*(next) {
    if (this.request.ip == '192.168.1.100') { // allow access only from this IP address
      yield next;
    } else {
		var msg = null;
		var categoryModel = this.model('Category');
		var query = categoryModel.where('view',true);
		yield query.exec(function(err,res){
			msg = res;
		});

		this.msg = msg;
      //this.status = 401;
      //this.body = 401;
	 yield next;
    }
  },



};
