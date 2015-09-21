var kc = require('koa-controller');
//~ var session = require('koa-generic-session');
var session = require('koa-session');
//var csrf = require('koa-csrf')
var lusca = require('koa-lusca');
var bodyparser = require('koa-bodyparser');
var koaBody = require('koa-body');
var kc = require('koa-controller');
var cookie = require('cookie-parser');
var reader = require('file-reader');
var fs = require('fs');
var md5 = require('md5');
var writeFile = require('write');
var laytpl = require('laytpl');
var laypage = require('laypage');
var _ = require('underscore');

//var koaBody   = require('koa-body');
var koaBody   = require('koa-better-body');
var gzip = require('koa-gzip');
var PropertiesReader =  require('properties-reader');

var appConfig = PropertiesReader('./config/app.conf');


var uploadConf = {
	icon: appConfig.get('upload.icon') || 'uploads/icons/',
	image: appConfig.get('upload.image') || 'uploads/images/',
	attachment: appConfig.get('upload.attachment') || 'uploads/attachments/',
}

var mkdir = function(dirpath, mode, callback) {
	if(fs.existsSync(uploadDir)) {
		callback(dirpath);
	} else {
		//尝试创建父目录，然后再创建当前目录
		mkdir(path.dirname(dirpath), mode, function(){
			fs.mkdir(dirpath, mode, callback);
		});
	}
};

var databaseConfig = PropertiesReader('./config/database.conf');
var host = databaseConfig.get('mongodb.main.host');
var port = databaseConfig.get('mongodb.main.port');
var dbname = databaseConfig.get('mongodb.main.dbname');
// Connection URL
var driver = 'mongodb://'+ host+':'+port+'/'+dbname;

var autoinc  = require('mongoose-id-autoinc');
var mongoose = require('mongoose');
//~ var Conn = mongoose.Connect( driver);
var Conn = mongoose.createConnection( driver);
//autoinc.init(Conn);

Conn.on('error',console.error.bind(console,'连接错误:'));
Conn.once('open',function(){
      //一次打开记录
});
var Schema = mongoose.Schema;


var idCounterModel = require('./models/IdCounter.model')(Schema,Conn);

var Models = {};
module.exports = function(app,path,option){

	var tplOpenTag = option.open ||"<%";
	var tplCloseTag = option.close || "%>";
	var tplCache = option.cache || false;
	var tplExt = option.ext || 'html'

	laytpl.config({
		open:   tplOpenTag,
		close:  tplCloseTag,
		cache:  tplCache,
	});

	var folder = new Date().toLocaleDateString();
	uploadConf['icon'] = path.join(uploadConf['icon'],folder)
	uploadConf['image'] = path.join(uploadConf['image'],folder)
	uploadConf['attachment'] = path.join(uploadConf['attachment'],folder)

	var dirname = path.dirname;
	var viewDir =  path.join(dirname(__dirname),'resource/views') ;
	var storageDir = path.join(dirname(__dirname),'storage') ;

	app.context.saveBase64Img = function(str,type,callback){
		var arr = str.split(';')
		imgExt = arr[0].split('/')[1]

		var imgData = arr[1].substring(7,arr[1].length);
		imgData = imgData.replace(/\s/g,"+");  // http传输时 可能把 + 变成了 空格（\s）
		var imgData = new Buffer(imgData, 'base64');
	//	str = str.toString();  无需
		var imgFileName = md5(imgData) + '.'+imgExt;

		var saveFile = path.join( storageDir,uploadConf.image ,imgFileName)
		if(typeof type=='function') callback = type;
		else if(type == 'append' && fs.existsSync(saveFile)){
			str = str + reader.file(saveFile);
		}
		if(typeof callback == 'function'){
			writeFile(saveFile, imgData, callback);
		}else{
			writeFile.sync(saveFile, imgData);
			var relativePath = path.join(uploadConf.image ,imgFileName)
			return relativePath.replace(/[\\]+/g,'/')
		}
	}

	app.context.base64_encode =function (str){
		var str = new Buffer(str);
		return str.toString('base64');
	}

	app.context.base64_decode =function (str){
		var str = new Buffer(str,'base64');
		return str.toString();
	}

	app.context.md5 =function (str){

		return md5(str);
	}


	app.use(koaBody({
	  patchNode: false,
	  patchKoa: true,
	  multipart: true,
	  fieldsKey: 'fields',
	  filesKey: 'files',
	  encoding: 'utf-8',
	  jsonLimit: '1mb',
	  formLimit: '1mb',
	  formidable: {
		multiples: true,
		keepExtensions: true,
		maxFields: 30
	  },
	  extendTypes: {
		// will parse application/x-javascript type body as a JSON string
		json: [
			'application/json',
			'application/json-patch+json',
			'application/vnd.api+json',
			'application/csp-report'
		  ],
		  // default form types
		form: [
			'application/x-www-form-urlencoded',
		  ],
		  // default multipart types
		multipart: [
			'multipart/form-data'
		  ],

	  }
	}));

	app.context.isEmptyObject = function(O){
		for (var x in O){
			return false;
		}
		return true;
	}

	// 分页
	app.context.pager = function(option){


		return laypage(option);
	}

	// laytpl 模板，较好的选择, 我增加了模板 layout 功能
	app.context.render = function(tpl, data) {

 		data['filename'] = path.join(viewDir ,tpl) + "." + tplExt;
		var tplDir = dirname(data['filename']);
		var tplStr = reader.file(data['filename']);
		tplStr = tplStr.replace(/\s+|\r|\t|\n/g, ' ')

		// 处理 extends
		var match = tplStr.match(/^\s*@extends\s+([^\s]+)\s*/)||[];
		var layoutFile = tplDir + '/' + match[1];
		var layoutStr = reader.file(layoutFile );
		layoutStr = layoutStr.replace(/\s+|\r|\t|\n/g, ' ')

		// 第一次 本系统编译处理模板

		// 处理 import 导入
		match = layoutStr.match(/@import\s+([^\s]*)\s*/g) || [];  // 加g 与不加， 结果大不相同
		var countOfImport = match.length;
		var layoutDir = dirname(layoutFile);
		while(countOfImport){
			countOfImport --;
			var importPath = match[countOfImport]
			importPath = importPath.replace(/@import\s+([^\s]*)\s*/,"$1");  // 加g 与不加， 结果大不相同

			var importFile = layoutDir + '/' +importPath;
			layoutStr = layoutStr.replace( new RegExp("@import\\s+"+importPath,'g'), reader.file( importFile));
		}

		match = tplStr.match(/@import\s+([^\s]*)\s*/g) || [];  // 加g 与不加， 结果大不相同
  		var countOfImport = match.length;
 		while(countOfImport){
			countOfImport --;
			var importPath = match[countOfImport]
			importPath = importPath.replace(/@import\s+([^\s]*)\s*/,"$1");  // 加g 与不加， 结果大不相同

			var importFile = tplDir + '/' +importPath;
			tplStr = tplStr.replace( new RegExp("@import\\s+"+importPath,'g'), reader.file( importFile));
		}

		// 处理 section 块
		var sectionStrArr = {};
		var sectionName = '';
		var sectionStartIndex = 0;
		var sectionStopIndex  = 0;
		var sectionNameInx = 0;
		var sectionNameExp = new RegExp("@section\\s+([^\\s]*)\\s*");
		match =tplStr.match(/@section/g) || [];

		var countOfSection = match.length;
		while(countOfSection){
			countOfSection --;
			sectionStartIndex = tplStr.indexOf('@section');
			sectionStopIndex = tplStr.indexOf('@stop');
			if( !sectionStopIndex ) break;
			var str2 =	tplStr.substring(sectionStartIndex,sectionStopIndex);
			tplStr = tplStr.substring(sectionStopIndex+5, tplStr.length);
			match = str2.match(sectionNameExp)||[];
			sectionName = match[1];
			sectionNameInx = str2.indexOf(sectionName);
			sectionStrArr[sectionName] = str2.substring(sectionNameInx+sectionName.length, str2.length);
		}

		for(var sectionName in sectionStrArr){
			layoutStr = layoutStr.replace( new RegExp("@yield\\s+"+sectionName,'g'), sectionStrArr[sectionName]);
		}

		layoutStr = layoutStr.replace( /@yield\s+[^\s]*\s+/g, ' '); //用空格清掉所有未使用的块

		// 第二次 由模板引擎编译处理
		return laytpl.render(layoutStr,data)
	}

	// 获取模型的方法
	app.context.model = function(modelName,namespace){
		var namespace = namespace ? namespace+'/' : '';
		if(!Models[modelName]) {
			Models[modelName] = require('./models/' + namespace + modelName + '.model')(Schema,Conn,idCounterModel);
		}
		return  Models[modelName];
	}

	app.context.get_session = function(key){
		if(typeof key == 'undefined') return this.session;
		else if(this.session[key]) return this.session[key]
		else return '';
	}

	app.context.set_session = function(key,value){
		this.session[key] = value
	}

	app.context.get_customer = function(key){
		if(typeof this.session.customer == 'undefined') return '';
		else if(typeof key == 'undefined') return this.session.customer;
		else if(this.session.customer[key]) return this.session.customer[key]
		else return '';
	}

	app.context.get_manager = function(key){
		if(typeof this.session.manager == 'undefined') return '';
		else if(typeof key == 'undefined') return this.session.manager;
		else if(this.session.manager[key]) return this.session.manager[key]
		else return '';
	}



	app.use(koaBody({formidable:{uploadDir: dirname(__dirname) + "/public/uploads"}}));

	//~ app.use(session({
			//~ defer:true,
			//~ store: storageDir + '/sessions',
			//~ key: 'ituyu',
			//~ secret:'^#&&^&4134(bdfd)*_()&$#^&^KJbkh434134vlkj343#$$#%!',
			//~ cookie: {maxage: 1000 * 60 * 60 * 24 * 30} //30 days
		//~ })
	//~ );

	app.keys = ['ituyu'];
	app.use(session(app,{
		key : 'ituyu',
		maxAge : 1000 * 3600 * 24 * 30

	}));

	app.use(function* (next) {
		var n = this.session.views || 0;
		this.session.views = ++n;
		return yield next;
	})

	//~ csrf(app)
	//~ app.use(csrf.middleware)


	// 防御
	app.use(lusca({
	  csrf: {
		header : 'x-xsrf-token', // in header
		key    : '_csrf',  		 // in model
		secret : 'csrfSecret',   // in session ，居然不能有下划线
	  },
	  csp: { /* ... */},
	  xframe: 'SAMEORIGIN',
	  p3p: 'ABCDEF',
	  hsts: { maxAge: 31536000, includeSubDomains: true },
	  xssProtection: true
	}));

	// 控制器和路由
	app.use(kc.tools()); // optional
	app.use(kc.router());

	app.use(gzip());

	return app;
}
