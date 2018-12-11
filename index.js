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
  require('./routes')(server);
});
