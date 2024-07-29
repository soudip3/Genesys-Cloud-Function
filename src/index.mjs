import dotenv from 'dotenv'
import {authentication} from './auth.mjs'
import { getQueueData } from "./getQueueData.mjs"

dotenv.config()

export const handler = async(event, context, callback) => {
	// collecting crendentials from .env file
    // const clientId = process.env.clientId
    // const clientSecret = process.env.clientSecret
    // const environment = process.env.environment //mypurecloud.com
	// const queuesId = ["79fcf7fc-b76d-4e39-b9bf-d60690bb10bd"]
	// collecting credentials from Genesys Cloud data action body 
	const clientId = event.clientId
	const clientSecret = event.clientSecret
	const environment = event.environment
	const queuesIdString = event.queuesId //if you have multiple queues then it should be comma separated
	const queuesId = queuesIdString.split(",")
	// get access token
	const accessToken = await authentication(clientId, clientSecret, environment)
	// get agents details who are longest idle from different queues
	const getQueueDetails = await getQueueData(accessToken, environment, queuesId)
	let jsonResult = {}
	let longestIdleAgentIndex = 0
	try{
		let dateTime = "9999-07-28T08:08:33.720Z" // max date time for comparision 
		// loop to get longest idle agent from across the queues
		for(let i=0; i<getQueueDetails.results.length; i++){
			if(dateTime>getQueueDetails.results[i].entities[0].activityDate){
				dateTime = getQueueDetails.results[i].entities[0].activityDate
				longestIdleAgentIndex = i //index of longest idle agent
			}
		}
		// creating json variable where adding longest idle agent details
		jsonResult = {
			"userId" : getQueueDetails.results[longestIdleAgentIndex].entities[0].userId,
			"activityTime" : getQueueDetails.results[longestIdleAgentIndex].entities[0].activityDate,
			"queueId" : getQueueDetails.results[longestIdleAgentIndex].group.queueId,
			"result" : 1 //use for we have any on queue agent there in queue or not
		}
	}
	catch{
		// if we have no agents are idle then it will come to catch block and create a json varibale
		jsonResult = {
			"userId" : "",
			"activityTime" : "",
			"queueId" : "",
			"result" : 0 //use for if no agent idle
		}
	}
	console.log(jsonResult) //use for log message
	return jsonResult
}

handler()