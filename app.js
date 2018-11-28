	var createError = require('http-errors');
	var express = require('express');
	var path = require('path');
	var cookieParser = require('cookie-parser');
	var logger = require('morgan');

	var indexRouter = require('./routes/index');
	var usersRouter = require('./routes/users');
	var creds = require('./creds.js');
	var Twitter = require('twitter');
	var Sentiment = require('sentiment');
	var sentiment = new Sentiment();
	var app = express();



	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	server.listen(80);


	/* 
	Twitter Variables and creds if hardcoded

	var Twitter = require('twitter');
	 
	var client = new Twitter({
	  consumer_key: '',
	  consumer_secret: '',
	  access_token_key: '',
	  access_token_secret: ''
	});


	*/

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

	var client = new Twitter({
	  consumer_key: creds.consumer_key,
	  consumer_secret: creds.consumer_secret,
	  access_token_key: creds.access_token_key,
	  access_token_secret: creds.access_token_secret
	});

	var tweetCount = 0;
	var sentimentScore=0;
	var tweetTotalSentiment = 0;

	app.get('/', function (req, res) {

	
  		res.sendFile(__dirname + '/search.html');
	});


	app.get('/search', function(req, res, next){

		if(req.query.keyword){
			console.log('form submitted!', req.query.keyword);
		
			var stream = client.stream('statuses/filter', { track: req.query.keyword, language:'en'} );
			stream.on('data', function(event) {
				tweetCount++;

				io.sockets.emit('news', {hello:  event.text });
				
				var result = sentiment.analyze(event.text);
				//console.log(result.score);
				sentimentScore = sentimentScore+result.score;
				io.sockets.emit('score', {getscore:  result.score });
				io.sockets.emit('tweetCounts', {tweetCounts:  tweetCount });
				io.sockets.emit('averageScore', {averageScore:  sentimentScore/tweetCount });
	  			//console.log(event && event.text);
	  				
						});
	 
			stream.on('error', function(error) {
	  			throw error;
						});
	

		io.sockets.emit('news', {hello:  'hello from server!' });
	  				
		}
		
		else{
			console.log('form not submitted..redirecting to search page');
			res.sendFile(__dirname+'/public/search.html')
		}
	
	//	res.send('Form Submitted - sending response!');
	})

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  next(createError(404));
	});

	// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};

	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});

	module.exports = app;
