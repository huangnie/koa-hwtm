module.exports = exports = function datetimePlugin (cellection, options) {
	cellection.add({
		created_at : {type:Date,default:Date.now}, // 创建时间
		updated_at : {type:Date,default:Date.now}, // 更新时间, 如编辑、暂时删除
	})

	cellection.pre('save', function (next) {
		this.updated_at = Date.now;
 		next()
	})

	if (options && options.index) {
		//cellection.path('lastMod').index(options.index)
 	}
}
