# Realtime_stock_price
codeclouds interview task
1.The Backend Node server Runs at port 7000 and has an API /webhook  which accepts data in JSON format.
2.When User enters company name in text box in UI the Scan button hits the /webhook API with method POST.
3.If request body doesn't have a company name or if company name is empty then API responses with status code 400.
4.UI will open a Websocket connection and subscribe the data with compay name.
5.when /webhook API responses with all previous company names then UI subscribes data from websocket with message having company names as comma separated values.
6.After 2 mins of hitting scan button websocket connection will be closed and no realtime data will be shown.
7.All unit test cases for the same are added in test folder.
8.All data is stored in mongodb.
9.All Backend code is written in Nodejs.
