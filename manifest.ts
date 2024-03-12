import { Manifest } from "deno-slack-sdk/mod.ts";
import { doClickupFunction } from './functions/doSendClickup.ts';
import { doQueryClickupFunction } from './functions/doQueryClickup.ts';
import { doAskApprovalFunction } from './functions/doAskApproval.ts';

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Water Bottle",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [doClickupFunction,doQueryClickupFunction, doAskApprovalFunction],
  workflows: [],
  outgoingDomains: ["api.clickup.com"],
  botScopes: [
    "commands", 
    "chat:write", 
    "chat:write.public",
    "groups:write",
    "groups:write.invites"],
});
