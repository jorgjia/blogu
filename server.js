var express=require('express');
var bodyparser=require('body-parser');
var app=new express();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

var loggedin=false;
var user="";
mongoose.connect("mongodb://jori:jori@ds147799.mlab.com:47799/bookstore");

mongoose.connection.once("open", function() {
	console.log("database connected");
//krijojme skemen e rregjistrimit 
	var UserSchema = new mongoose.Schema({
		email:String,
		username:String,
		password:String
	});
//krijojme skemen per postet
var PostSchema =new mongoose.Schema({
	title:String,
	url:String,
	data:String,
	user:String
});
	
var User=mongoose.model('User',UserSchema);
var Post=mongoose.model('Post',PostSchema);
//ketu behet rregjistrimi ne database
	app.post('/signup',function(req,res) {			
		var username=req.body.username;
		var email=req.body.email;
		var password=req.body.password;
		User.findOne({
			
			username:username,
			email:email
			
			
	},function(err,item){
		if(err)console.log(err);
		else if(item!= null)res.json( { message: "you are register"});
		else {
			User.create({
			username:username,
			email:email,
			password:password
		},function(err,item){
			if(err){console.log(err);
			}else {console.log(item);
			}
		});
		}
	})
	});
	
	
	app.get('/profile',function(req,res){
		if(loggedin==true) res.sendFile(__dirname +"/public/home.html");
		else res.send("ju nuk jeni i loguar");

		
	});
app.get("/get_all_posts",function(req,res){
	Post.find({},function(err,item){
			if(err)console.log(err);
			else res.json({data:item});

	});


});


app.post("/new_post",function(req,res){
	var title=req.body.title;
	var url=req.body.url;
	var data=req.body.data;
	console.log(title);
	console.log(url);
	console.log(data);

	Post.create({
		title:title,
		url:url,
		data:data,
		user:user

	},function(err,item){
		if(err) res.json({message:'error'});

		else res.json({message:'u kriua'});
	});

});

app.get('/logout',function(req,res){
	loggedin=false;
	res.json({message:"sukses"});

});
//kerkojme ne database per userin qe rregjistruam 
	app.post('/login',function(req,res){
		var username=req.body.username;	
		var password=req.body.password;
		
		console.log(username);
		console.log(password);
		
		User.findOne({
			username:username,
			password: password
		},function(err,item){
			if(err){
				console.log(err);
				res.json({message:err});
			}else if(item==null){
				res.json({message :"nuk u gjet useri"});
			}else {loggedin=true; user=username;
			res.json({message:"u gjet"});
			
			}
		});
	
		
		
	});
});

app.listen(process.env.PORT || 7000);

// per tu krijuar 1.nje button krijo qe te beje te mundur krijimin e nje artikulli
//2.nje input form per te hedhur artikullin 
