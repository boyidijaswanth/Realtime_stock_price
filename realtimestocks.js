// const https = require("http");
const config = require('./settings.json')
const stockdb = require('./stockdb.js');
const stock_db = new stockdb();
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors());
app.options('*', cors());
app.use(express.json())
class RealtimeStocks {
    constructor() {
        this.env = "dev";
        this.config = config[this.env];
        this.config = this.config.app;
        this.createServer();
    }
    createServer() {
        this.port = this.config.port
        app.post('/webhook', this.saveCompanyName);
        // https.createServer(app).listen(this.port, () => {
        //     console.log(`CORS-enabled web server listening on port ${this.port}`)
        // });
        app.listen(this.port);
        console.log(`CORS-enabled web server listening on port ${this.port}`)
    }
    async saveCompanyName(request, response) {
        let data = request.body;
        if(!data.company || (data.company && data.company.length ==0)) {
            response.status(400).send({ status: "Failed", message: "company name cannot be empty or NULL" });
            return;
        }
        let update_company_names= null;
        let company_names = await stock_db.get_existing_companies();
        if (company_names instanceof Error) {
            response.status(400).send({ status: "Failed", message: company_names.message });
            return;
        }
        company_names = company_names || {}
        company_names = company_names.company
        company_names = company_names || [];
        let unique_company_names = new Set(company_names);
        unique_company_names.add(data.company);
        unique_company_names = Array.from(unique_company_names)
        update_company_names = await stock_db.update_companies({company: company_names},{company: unique_company_names})
        if(update_company_names instanceof Error) {
        	response.status(400).send({ status: "Failed", message: update_company_names.message });
            return;
        }
        //this is unique_company_names will be passed in websockets to subscribe realtime data with comma separated
        response.send({ status: "Success", message: { company: unique_company_names } });
        return;
    }
}
let server = new RealtimeStocks();
module.exports = app;