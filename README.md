# Sentiment Analysis with NODEJS
<h2> Real-time AFINN-based sentiment analysis on streaming Twitter feed </h2> 
		<p> Twitter Streaming feed is requested based on user-entered keyword which then visualize result by change in color based on real time sentiment analysis on keyword. Average sentiment is calculated by total number of tweets processed in real time divided by sum of estimate of each tweet sentiment made from its text. </p>
		<p> Technologies Used:</p>
		<ul>
			<li>NODEJS</li>
			<li>ExpressJS</li>
			<li>Twitter API</li>
			<li>Socket.io</li>
			<li>HTML</li>	
		</ul>
		
TODO:
Keep http connection Alive by setting header to "keep-alive" in order to prevent timeout when displaying result.
