
const axios = require('axios')
import { CommandResponses, HTTPRequest } from "../../global";

export class ReqMaker{
    static async sendRequest(req: HTTPRequest): Promise<CommandResponses> {
        const {url, method, headers, data} = req
        return new Promise((resolve, reject) => {

            axios({
              url: url,
              method: method,
              headers: headers,
              data: data,
              // timeout
            }).then((response) => {
              resolve({ error: false, continue: true,  data: response.data})
            }).catch((error) => {
        
              if(error.code === 'ECONNABORTED'){
                reject({ error: true, continue: true, message: 'The request timed out.', errorCode: 101 }) 
              } else if(error.response) {
                reject({ error: true, continue: true, message: error.response.data, errorCode: 102 })
              } else if (error.request) {
                reject({ error: true, continue: true, message: 'Could not reach server', errorCode: 103 }) // eslint-disable-line
              } else {
                reject({ error: true, continue: true, message: 'Unknown request error', errorCode: 104 }) // eslint-disable-line
              }
            })
          })
    }
}