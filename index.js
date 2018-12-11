const config = require('./config');
const restify = require('restify');
const restifyPlugins = require('restify-plugins');

const server = restify.createServer({
	name: config.name,
	version: config.version,
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
server.use(restifyPlugins.bodyParser());

server.listen(config.port, () => {
	// // establish connection to mongodb
	// mongoose.Promise = global.Promise;
	// mongoose.connect(config.db.uri, { useMongoClient: true });
  //
	// const db = mongoose.connection;
  //
	// db.on('error', (err) => {
	//     console.error(err);
	//     process.exit(1);
	// });
  //
	// db.once('open', () => {
	    require('./routes')(server);
	    console.log(`Server is listening on port ${config.port}`);
	// });
});
