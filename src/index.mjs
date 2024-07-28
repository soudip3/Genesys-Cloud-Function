import dotenv from 'dotenv'
import {authentication} from './auth.mjs'
import { getSLA } from "./getSLA.mjs"

dotenv.config()

export const handler = async(event, context, callback) => {
    // const clientId = process.env.clientId
    // const clientSecret = process.env.clientSecret
    // const environment = process.env.environment
	// const queuesId = ["d8e08b26-402d-490e-a433-b2348a0b9f17","37a8972f-9875-488f-bcd7-3f63a6eb4e53"]
	const clientId = event.clientId
	const clientSecret = event.clientSecret
	const environment = event.environment
	const queuesId = event.queuesId
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