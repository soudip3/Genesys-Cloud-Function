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
	const getUser = await getSLA(accessToken, environment, queuesId)
	try{
		for(let i=0; i<getUser.results.length; i++){
			console.log(`User id ${i}: `+ getUser.results[i].entities[0].userId)
			console.log(`User activityDate ${i}: `+ getUser.results[i].entities[0].activityDate)
			console.log(`Queue id ${i}: `+ getUser.results[i].group.queueId)
		}
	}
	catch{
		console.log("All agents are offline")
	}
	console.log(JSON.stringify(getUser))
}

//handler()