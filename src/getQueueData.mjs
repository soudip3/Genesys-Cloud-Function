import fetch from "node-fetch";

export const getQueueData = async (access_token, environment, queuesId) => {
    // creating body
    const params ={
        "subscribe": true,
        "metrics": [
            {
                "metric": "oUserRoutingStatuses",
                "details": true
            },
            {
                "metric": "oUserPresences",
                "details": true
            },
            { 
                "metric": "oMemberUsers",
                "details": true
            }
        ],
        "groupBy": [
          "queueId"
        ],
        "order": "desc",
        "filter": {
            "type": "and",
            "predicates": [
                {
                    "dimension": "queueMembershipStatus",
                    "value": "active"
                }
            ],
            "clauses": [
                {
                    "type": "or",
                    "predicates": [
                        {
                            "dimension": "systemPresence",
                            "value": "ON_QUEUE"
                        }
                    ]
                },
                {
                    "type": "or",
                    "predicates": [

                    ]
                }
            ]
        }
    };
    // adding dynamic values in predicates array
    for (let i =0; i<queuesId.length; i++){
        params.filter.clauses[1].predicates
        .push({
            "dimension": "queueId",
            "value": `${queuesId[i]}`
        })
    }
    // fetching routing activity query
	const response = await fetch(`https://api.${environment}/api/v2/analytics/routing/activity/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`
		},
		body: JSON.stringify(params)
	})
    const data = await response.json();
    // returning json data
    return data;
}