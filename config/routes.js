// config/routes.js
module.exports = {

// 前台访问

	// 首页
	'/'				: { to: 'picture/index#home' },
	'/home'			: { to: 'picture/index#home' },

	// 帮助
	'/help'			: { to: 'help/index#index' },

	// 用户
	'/auth/register'		: { to: 'customer/auth#register' },
	'post /auth/storage'	: { to: 'customer/auth#storage' },
	'/auth/login'			: { to: 'customer/auth#login' },
	'post /auth/check'		: { to: 'customer/auth#check' },
	'post /auth/exit'		: { to: 'customer/auth#exit' },

	'/customer'				: { to: 'customer/index#index' },
	'/customer/index'		: { to: 'customer/index#index' },
	'/customer/edit'		: { to: 'customer/index#edit' },
	'post /customer/save'	: { to: 'customer/index#save' },

	// 用户个人中心
	'/customer/picture/:page?'	: { to: 'customer/picture/index#index' },
	'/customer/article/:page?'	: { to: 'customer/article/index#index' },
	'/customer/chat/:page?'		: { to: 'customer/chat/index#index' },

	// 用户VIP中心
	'/customer/vct'					: { to: 'customer/index#index' },
	'/customer/vct/edit/:id?'		: { to: 'customer/index#edit' },
	'post /customer/vct/save'		: { to: 'customer/index#save' },

	// 图片
	'/picture/:page?' 				: { to: 'picture/index#index', constraint: 'test#index' },
 	'/picture/show/:id?'			: { to: 'picture/index#show' },
	'/picture/category/:id?/:page?' : { to: 'picture/index#category' },
	'/picture/tag/:id?/:page?'	    : { to: 'picture/index#tag' },

	'/picture/create'				: { to: 'picture/index#create' },
	'/picture/edit/:id?'			: { to: 'picture/index#edit' },

	'post /picture/praise'			: { to: 'picture/index#praise' },
	'post /picture/vomit'			: { to: 'picture/index#vomit' },
	'post /picture/comment'			: { to: 'picture/index#comment' },
	'post /picture/save'			: { to: 'picture/index#save' },
	'post /picture/upImg'			: { to: 'picture/index#upImg' },

	// 文章
	'/article/:page?' 				: { to: 'article/index#index' },
 	'/article/show/:id?'			: { to: 'article/index#show' },
	'/article/category/:id?/:page?'	: { to: 'article/index#category' },
	'/article/tag/:id?/:page?'	    : { to: 'article/index#tag' },

	'/article/create'				: { to: 'article/index#create' },
	'/article/edit/:id?'			: { to: 'article/index#edit' },

	'post /article/praise'			: { to: 'article/index#praise' },
	'post /article/comment'			: { to: 'article/index#comment' },
	'post /article/vomit'			: { to: 'article/index#vomit' },
	'post /article/save'			: { to: 'article/index#save' },
	'post /article/upImg'			: { to: 'article/index#upImg' },

	// 聊天
	'/chat' 						: { to: 'chat/secret#index' },
	'/chat/free' 					: { to: 'chat/free#index' },
	'/chat/secret/:id?' 			: { to: 'chat/secret#index' },
	'/chat/discuss/:id?'			: { to: 'chat/discuss#index' },

	'/chat/record/free/:id?'		: { to: 'chat/free#record' },
	'/chat/record/secret/:id?'		: { to: 'chat/secret#record' },
	'/chat/record/discuss/:id?'		: { to: 'chat/discuss#record' },


// 后台管理

	//后台首页
	'/admin' 						: { to: 'admin/index#index' },
	'/admin/index' 					: { to: 'admin/index#index' },

	// 系统邮件
	'/admin/email/:page?' 	 		: { to: 'admin/index#email' },

	// 图片
	'/admin/picture'				: { to: 'admin/picture/index#index' },
	'/admin/picture/index/:page?'	: { to: 'admin/picture/index#index' },
	'/admin/picture/trash/:page?'	: { to: 'admin/picture/index#trash' },
	'/admin/picture/create'			: { to: 'admin/picture/index#create' },
	'/admin/picture/edit/:id?'		: { to: 'admin/picture/index#edit' },

	'post /admin/picture/upImg'		: { to: 'admin/picture/index#upImg' },
 	'post /admin/picture/save'		: { to: 'admin/picture/index#save' },
	'post /admin/picture/remove'	: { to: 'admin/picture/index#remove' },
	'post /admin/picture/restore'	: { to: 'admin/picture/index#restore' },
	'post /admin/picture/destory'	: { to: 'admin/picture/index#destory' },

	// 文章
	'/admin/article'				: { to: 'admin/article/index#index' },
	'/admin/article/index/:page?'	: { to: 'admin/article/index#index' },
	'/admin/article/trash/:page?'	: { to: 'admin/article/index#trash' },
	'/admin/article/create'			: { to: 'admin/article/index#create' },
	'/admin/article/edit/:id?'		: { to: 'admin/article/index#edit' },

	'post /admin/article/upImg'		: { to: 'admin/article/index#upImg' },
 	'post /admin/article/save'		: { to: 'admin/article/index#save' },
	'post /admin/article/remove'	: { to: 'admin/article/index#remove' },
	'post /admin/article/restore'	: { to: 'admin/article/index#restore' },
	'post /admin/article/destory'	: { to: 'admin/article/index#destory' },

	// 分类
	'/admin/category'				: { to: 'admin/category/index#index' },
	'/admin/category/index/:page?'	: { to: 'admin/category/index#index' },
	'/admin/category/trash/:page?'	: { to: 'admin/category/index#trash' },
	'/admin/category/create'		: { to: 'admin/category/index#create' },
	'/admin/category/edit/:id?'		: { to: 'admin/category/index#edit' },

	'post /admin/category/upImg'	: { to: 'admin/category/index#upImg' },
 	'post /admin/category/save'		: { to: 'admin/category/index#save' },
	'post /admin/category/remove'	: { to: 'admin/category/index#remove' },
	'post /admin/category/restore'	: { to: 'admin/category/index#restore' },
	'post /admin/category/destory'	: { to: 'admin/category/index#destory' },

	// 标签
	'/admin/tag'					: { to: 'admin/tag/index#index' },
	'/admin/tag/index/:page?'		: { to: 'admin/tag/index#index' },
	'/admin/tag/trash/:page?'		: { to: 'admin/tag/index#trash' },
	'/admin/tag/create'				: { to: 'admin/tag/index#create' },
	'/admin/tag/edit/:id?'			: { to: 'admin/tag/index#edit' },

	'post /admin/tag/upImg'			: { to: 'admin/tag/index#upImg' },
	'post /admin/tag/save'			: { to: 'admin/tag/index#save' },
	'post /admin/tag/remove'		: { to: 'admin/tag/index#remove' },
	'post /admin/tag/restore'		: { to: 'admin/tag/index#restore' },
	'post /admin/tag/destory'		: { to: 'admin/tag/index#destory' },


	// 聊天
	'/admin/chat' 						: { to: '/admin/chat/index#free' },
	'/admin/chat/free' 					: { to: '/admin/chat/index#free' },
	'/admin/chat/secret/:id?' 			: { to: '/admin/chat/index#secret' },
	'/admin/chat/discuss/:id?'			: { to: '/admin/chat/index#discuss' },
	'/admin/chat/record/:id?'			: { to: '/admin/chat/free#record' },
	'/admin/chat/record/free/:id?'		: { to: '/admin/chat/free#record' },
	'/admin/chat/record/secret/:id?'	: { to: '/admin/chat/secret#record' },
	'/admin/chat/record/discuss/:id?'	: { to: '/admin/chat/discuss#record' },


	// 用户
	'/admin/customer'						: { to: 'admin/customer/index#index' },
	'/admin/customer/index/:type?/:page?'	: { to: 'admin/customer/index#index' },  	//type 取值 vip, naomal, all
	'/admin/customer/trash/:type?/:page?'	: { to: 'admin/customer/index#trash' },
	'/admin/customer/create'				: { to: 'admin/customer/index#create' },
	'/admin/customer/edit/:id?'				: { to: 'admin/customer/index#edit' },

	'post /admin/customer/save'				: { to: 'admin/customer/index#save' },
	'post /admin/customer/remove'			: { to: 'admin/customer/index#remove' },
	'post /admin/customer/restore'			: { to: 'admin/customer/index#restore' },
	'post /admin/customer/destory'			: { to: 'admin/customer/index#destory' },

	// 用户的 VIP 类型管理
	'/admin/customer/vcg'					: { to: 'admin/customer/vipCategory#index' },
	'/admin/customer/vcg/index/:page?'		: { to: 'admin/customer/vipCategory#index' },
	'/admin/customer/vcg/trash/:page?'		: { to: 'admin/customer/vipCategory#trash' },
	'/admin/customer/vcg/create'			: { to: 'admin/customer/vipCategory#create' },
	'/admin/customer/vcg/edit/:id?'			: { to: 'admin/customer/vipCategory#edit' },

	'post /admin/customer/vcg/save'			: { to: 'admin/customer/vipCategory#save' },
	'post /admin/customer/vcg/remove'		: { to: 'admin/customer/vipCategory#remove' },
	'post /admin/customer/vcg/restore'		: { to: 'admin/customer/vipCategory#restore' },
	'post /admin/customer/vcg/destory'		: { to: 'admin/customer/vipCategory#destory' },

	// 管理员
	'/admin/manager' 						: { to: 'admin/manager/index#index' },
	'/admin/manager/index/:group?/:page?' 	: { to: 'admin/manager/index#index' },  	//roup 取值 ${group_id}, all
	'/admin/manager/trash/:group?/:page?' 	: { to: 'admin/manager/index#trash' },
	'/admin/manager/create' 				: { to: 'admin/manager/index#create' },
	'/admin/manager/edit/:id?'				: { to: 'admin/manager/index#edit' },

 	'post /admin/manager/save'				: { to: 'admin/manager/index#save' },
 	'post /admin/manager/remove'			: { to: 'admin/manager/index#remove' },
 	'post /admin/manager/restore'			: { to: 'admin/manager/index#restore' },
 	'post /admin/manager/destory'			: { to: 'admin/manager/index#destory' },


	// 管理员分组
	'/admin/manager/group'					: { to: 'admin/manager/group#index' },
	'/admin/manager/group/index/:page?'		: { to: 'admin/manager/group#index' },
	'/admin/manager/group/trash/:page?'		: { to: 'admin/manager/group#trash' },
	'/admin/manager/group/create'			: { to: 'admin/manager/group#create' },
	'/admin/manager/group/edit/:id?'		: { to: 'admin/manager/group#edit' },

	'post /admin/manager/group/save'		: { to: 'admin/manager/group#save' },
	'post /admin/manager/group/remove'		: { to: 'admin/manager/group#remove' },
	'post /admin/manager/group/restore'		: { to: 'admin/manager/group#restore' },
	'post /admin/manager/group/destory'		: { to: 'admin/manager/group#destory' },

	// 系统设置
	'/admin/setting' 				 		: { to: 'admin/setting/site#index' },
	'/admin/setting/site' 			 		: { to: 'admin/setting/site#index' },
	'/admin/setting/user' 			 		: { to: 'admin/setting/user#index' },
	'/admin/setting/flush' 			 		: { to: 'admin/setting/flush#index' },
	'post /admin/setting/site/save'  		: { to: 'admin/setting/site#save' },
	'post /admin/setting/user/save'  		: { to: 'admin/setting/user#save' },
	'post /admin/setting/flush/save' 		: { to: 'admin/setting/flush#save' },


	// 其他路由
 	//~ 'get /users/:id/words/:slug*': { to: 'events#words' },
	//~ 'get /event/:slug+': { to: 'events#index', constraint: 'api#ip' },
	//~ // redirections
	//~ 'get /to/google': { to: 'http://www.google.com' },
	//~ 'get /to/home': { to: '/' },

	//~ // using a function
	//~ 'get /events/:id': { to: function *(id) { this.body = 'datatat' } },

};
