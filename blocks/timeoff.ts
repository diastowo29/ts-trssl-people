export function timeoffListBlock(taskList) {
    let sick = false;
    let annual = false;
    let holiday = false;
    let maternity = false;
    let sickBlock:any[] = [];
    let annualBlock:any[] = [];
    let holidayBlock:any[] = [];
    let maternityBlock:any[] = [];
    taskList.forEach(task => {
        let emoji = '';
        switch (task.type) {
            case 1:
                sick = true;
                emoji = 'mask';
                sickBlock.push(timeoffBlock(task.name, task.id, task.start, task.end, emoji));
                break;
            case 2:
                holiday = true;
                emoji = 'beach_with_umbrella';
                holidayBlock.push(timeoffBlock(task.name, task.id, task.start, task.end, emoji));
                break;
            case 3:
                annual = true;
                emoji = 'calendar';
                annualBlock.push(timeoffBlock(task.name, task.id, task.start, task.end, emoji));
                break;
            case 4:
                maternity = true;
                emoji = 'baby';
                maternityBlock.push(timeoffBlock(task.name, task.id, task.start, task.end, emoji));
                break;
            default:
                break;
        }
    });
    var headerBlocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Heads up! Check out all of these requests!"
            }
        }
    ]
    let blockList = [...headerBlocks];
    if (sick) {
        blockList = blockList.concat(divider('Sick Leave'));
        blockList = blockList.concat(sickBlock);
    }
    // if (annual) {
    //     blockList = blockList.concat(divider('Annual Leave'));
    //     blockList = blockList.concat(annualBlock);
    // }
    // if (holiday) {
    //     blockList = blockList.concat(divider('Holiday Leave'));
    //     blockList = blockList.concat(holidayBlock);
    // }
    // if (maternity) {
    //     blockList = blockList.concat(divider('Maternity Leave'));
    //     blockList = blockList.concat(maternityBlock);
    // }
    var msgBlock = { blocks : blockList}
    return msgBlock;
}

function divider (title: string) :any[] {
    return [
        {
            type: "divider"
        },
        {
            type: "rich_text",
            elements: [
                {
                    type: "rich_text_section",
                    elements: [
                        {
                            type: "text",
                            text: title,
                            style: {
                                bold: true
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

function timeoffBlock (name, id, start, end, emoji) {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `:${emoji}: *${name}*\nStart: ${start} until ${end}`
        },
        accessory: {
            type: "static_select",
            placeholder: {
                type: "plain_text",
                emoji: true,
                text: "Action"
            },
            options: [
                {
                    text: {
                        type: "plain_text",
                        emoji: true,
                        text: "Approve"
                    },
                    value: id
                },
                {
                    text: {
                        type: "plain_text",
                        emoji: true,
                        text: "Reject"
                    },
                    value: id
                }
            ],
            action_id: "approve_my_task"
        }
    }
}