// const { config } = require("../config/config");
const { Client } = require("@elastic/elasticsearch");
const { winstonLogger } = require("./logger");

const log = winstonLogger(
  `${process.env.ELASTIC_SEARCH_URL}`,
  "authElasticSearchServer",
  "debug"
);

const elasticSearchClient = new Client({
  node: `${process.env.ELASTIC_SEARCH_URL}`,
});

async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    log.info("AuthService connecting to ElasticSearch...");
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log("error", "AuthService checkConnection() method:", error);
    }
  }
}

module.exports = {
  checkConnection,
};
