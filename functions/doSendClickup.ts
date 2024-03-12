import {DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";
// import https from "node:https";
// import fs from "node:fs";

export const doClickupFunction = DefineFunction({
    callback_id: "do_clickup_function",
    title: "Send to Click Up",
    description: "Send Time Off Request to Slack",
    source_file: "functions/doSendClickup.ts",
    input_parameters: {
        properties: {
            requester: {
                type: Schema.types.string,
                description: "Person who submit the form"
            },
            manager: {
                type: Schema.types.string,
                description: "The Manager"
            },
            request_type: {
                type: Schema.types.string,
                description: "Time Off Request Type"
            },
            start_timeoff: {
                type: Schema.types.string,
                description: "Start of Time Off"
            },
            end_timeoff: {
                type: Schema.types.string,
                description: "End of TIme Off"
            },
            request_reason: {
                type: Schema.types.string,
                description: "Request Reason"
            },
            replaced_by: {
                type: Schema.types.string,
                description: "Replaced By"
            },
        },
        required: ["requester", "manager", "request_type", "start_timeoff", "end_timeoff"]
    },
    output_parameters: {
        properties: {
          task_id: {
            type: Schema.types.string,
            description: "Click Up Task ID",
          },
        },
        required: ["task_id"],
    },
});

export default SlackFunction(doClickupFunction, async ({
    inputs,
    client,
    env
},) => {
    let requestType = 0;
    if (inputs.request_type.includes('Sick Leave')) {
        requestType = 1;
    } else if (inputs.request_type.includes('Annual Leave')) {
        requestType = 3;
    } else if (inputs.request_type.includes('Maternity Leave')) {
        requestType = 4;
    } else if (inputs.request_type.includes('Holiday')) {
        requestType = 2;
    } else {
        requestType = 0;
    }
    // console.log(date.getTime());

    const body = JSON.stringify({
        "name": inputs.requester,
        "tags": [
          "slack"
        ],
        "custom_fields": [
          {
              "id": "946576df-811b-458e-ab2b-7aa26f83ebc6",
              "value": requestType
          },
          {
              "id": "161b2941-051f-4ce3-b175-fb6d4f2d731b",
              "value": convertTime(inputs.start_timeoff) // start
          },
          {
              "id": "a5aa836a-0f80-4fae-991c-83aa5d0d3545",
              "value": convertTime(inputs.end_timeoff) // end
          },
          {
              "id": "a953d4bd-7e1b-42be-8560-8bb5aef16065",
              "value": inputs.request_reason // reason
          }
        ]
    });
    // console.log(inputs);
    // console.log(body);
    const headers = {
        Authorization: env['API_TOKEN'],
        "Content-Type": "application/json"
    };
    // console.log(headers)
    const task = await fetch(`https://api.clickup.com/api/v2/list/901601572648/task`, {
        method: "POST",
        headers,
        body
    })
    let taskContent = await task.json();
    // console.log(taskContent)
    return { completed: true, outputs: { task_id: taskContent.id }}
} ).addBlockActionsHandler([
    "rerun_job", 'assign_job', 'discuss_job'
], async ({body, client}) => {})
.addViewSubmissionHandler([
    'new-channel-view'
], async ({body, client, view}) => {})

function convertTime (dateString: string) {
    const dtStr = dateString;
    const [y, m, d] = dtStr.split(/-|\//);
    const date = new Date(y, m - 1, d);
    return date.getTime().toString();
}