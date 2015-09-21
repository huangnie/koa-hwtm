/**
  *
  *
  */

var data = { title:'常见问题', module:'help',contoller:'index',action:'index'}


module.exports = {
	index: function * (page){

		data['user'] = {}
		data.user['_id'] = this.get_customer('_id');
		data.user['name'] = this.get_customer('name');
		data.user['email'] = this.get_customer('eamil');
		data.user['tel'] = this.get_customer('tel');

		data['fqa'] =  [
				{
					id:1,
					question:"疑问1",
					answer:'待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解',
					icon:'/img/sample.jpg',
					created_at: '2015-09-08 13:30:30',
					updated_at: '2015-09-08 13:30:30'

				},
				{
					id:2,
					question:"疑问2",
					answer:'待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解',
					icon:'/img/sample.jpg',
					created_at: '2015-09-08 13:30:30',
					updated_at: '2015-09-08 13:30:30'

				},
				{
					id:3,
					question:"疑问3",
					answer:'待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解 待解',
					icon:'/img/sample.jpg',
					created_at: '2015-09-08 13:30:30',
					updated_at: '2015-09-08 13:30:30'

				}];

		this.body = this.render('help',data);
 	}


};
