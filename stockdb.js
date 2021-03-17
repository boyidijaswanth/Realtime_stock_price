const config = require('./settings.json')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
class Stockdb {
    constructor() {
        this.env = "dev";
        this.config = config;
        this.config = this.config[this.env];
        this.config = this.config.database
        this.db_client = null;
        this.get_db_client();
    }
    async get_db_client() {
        if (!this.db_client || !this.db_client.topology || (this.db_client.topology && this.db_client.topology.isConnected())) {
            this.url = `${this.config.db}://${this.config.host}:${this.config.port}/${this.config.dbname}`;
            this.db_client = await MongoClient.connect(this.url);
            if (this.db_client instanceof Error) {
                console.log(this.db_client);
            }
        }
        return this.db_client;
    }
    async get_existing_companies() {
    	let company_names = null
        this.db_client = await this.get_db_client();
        this.collection = this.db_client.collection(this.config.collection);
        company_names = await this.collection.findOne({});
        return company_names; 
    }
    async update_companies(existing,updated) {
    	let updated_company_names = null
        this.db_client = await this.get_db_client();
        this.collection = this.db_client.collection(this.config.collection);
        updated_company_names = await this.collection.updateOne(existing,updated,{ upsert: true });
        return updated_company_names;
    }
}
module.exports = Stockdb;