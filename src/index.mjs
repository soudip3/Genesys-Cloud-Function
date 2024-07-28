import dotenv from 'dotenv'
import {authentication} from './auth.mjs'
import { getSLA } from "./getSLA.mjs"

dotenv.config()

export const handler = async(event, context, callback) => {
    // const clientId = process.env.clientId
    // const clientSecret = process.env.clientSecret
    // const environment = process.env.environment
	// const queuesId = ["81ee22da-b027-481c-8135-3742da0d8639","73aa14fa-54d4-4bf4-8964-5038d9fd8129"]
	const clientId = event.clientId
	const clientSecret = event.clientSecret
	const environment = event.environment
	const queuesIdString = event.queuesId
	const queuesId = queuesIdString.split(",")
	const accessToken = await authentication(clientId, clientSecret, environment)
	const getSlaDetails = await getSLA(accessToken, environment, queuesId)
	let jsonResult = {}
	try{
		let longestIdleAgentIndex = 0
		let dateTime = "2000-07-28T08:08:33.720Z"
		for(let i=0; i<getSlaDetails.results.length; i++){
			if(dateTime<getSlaDetails.results[i].entities[0].activityDate){
				dateTime = getSlaDetails.results[i].entities[0].activityDate
				longestIdleAgentIndex = i
			}
		}
		jsonResult = {
			"userId" : getSlaDetails.results[longestIdleAgentIndex].entities[0].userId,
			"activityTime" : getSlaDetails.results[longestIdleAgentIndex].entities[0].activityDate,
			"queueId" : getSlaDetails.results[longestIdleAgentIndex].group.queueId,
			"result" : 1
		}
	}
	catch{
		jsonResult = {
			"userId" : "",
			"activityTime" : "",
			"queueId" : "",
			"result" : 0
		}
	}
	console.log(jsonResult)
	return jsonResult
}

//handler()