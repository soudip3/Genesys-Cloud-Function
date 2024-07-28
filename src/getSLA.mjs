import fetch from "node-fetch";

export const getSLA = async (access_token, environment, queuesId) => {
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
    for (let i =0; i<queuesId.length; i++){
        params.filter.clauses[1].predicates
        .push({
            "dimension": "queueId",
            "value": `${queuesId[i]}`
        })
    }
	const response = await fetch(`https://api.${environment}/api/v2/analytics/routing/activity/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`
		},
		body: JSON.stringify(params)
	})
    const data = await response.json();
    return data;
}