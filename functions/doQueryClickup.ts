import {DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";
import {timeoffListBlock} from "../blocks/timeoff.ts";
// import https from "node:https";
// import fs from "node:fs";

export const doQueryClickupFunction = DefineFunction({
    callback_id: "do_query_clickup_function",
    title: "Query Time Off",
    description: "Query Time Off List",
    source_file: "functions/doQueryClickup.ts",
    input_parameters: {
        properties: {
            recipient: {
                type: Schema.slack.types.user_id,
                description: "User who used the workflow",
            },
            channel: {
                type: Schema.slack.types.channel_id,
                description: "Channel where workflow used",
            },
            request_type: {
                type: Schema.types.string,
                description: "Time Off Request Type"
            },
            request_status: {
                type: Schema.types.string,
                description: "Request Approval Status"
            },
        },
        required: ["request_status", "request_type"]
    },
    /* output_parameters: {
        properties: {
          task_id: {
            type: Schema.types.string,
            description: "Click Up Task ID",
          },
        },
        required: ["task_id"],
    }, */
});

export default SlackFunction(doQueryClickupFunction, async ({
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
    const headers = {
        Authorization: env['API_TOKEN'],
        "Content-Type": "application/json"
    };
    // console.log(headers)
    let task = await fetch(`https://api.clickup.com/api/v2/list/901601463693/task`, {
        method: "GET",
        headers
    });

    let taskContent = await task.json();
    return {completed: true};
    /* var timeoffList: any[] = [];
    taskContent.tasks.forEach(task => {
        let taskList = {};
        taskList['name'] = task.name;
        taskList['id'] = task.id;
        task.custom_fields.forEach(taskField => {
            if (taskField.name == 'Request Type') {
                taskList['type'] = taskField.value;
            }
            if (taskField.name == 'Start of Time-Off') {
                taskList['start'] = taskField.value;
            }
            if (taskField.name == 'End of Time-Off') {
                taskList['end'] = taskField.value;
            }
        });
        timeoffList.push(taskList);
    });
    let blocks = timeoffListBlock(timeoffList);
    const message = await client.chat.postMessage(
                {channel: inputs.channel, blocks: blocks.blocks}
            );
    if (message.ok) {
        console.log(message.ok);
        return { completed: false };
    } else {
        console.log(message);
    } */
}).addBlockActionsHandler([
    "taskAction", 'approve_my_task'
], async ({body, client}) => {
    console.log(body)
})
.addViewSubmissionHandler([
    'new-channel-view'
], async ({body, client, view}) => {})

function convertTime (dateString: string) {
    const dtStr = dateString;
    const [y, m, d] = dtStr.split(/-|\//);
    const date = new Date(y, m - 1, d);
    return date.getTime().toString();
}