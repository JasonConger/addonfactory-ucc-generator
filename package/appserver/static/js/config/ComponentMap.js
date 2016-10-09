const normalEscape = field => field.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const mappingServiceName = field => {
    return field.indexOf('ta_crowdstrike_falcon_host_inputs') > -1 ?
        "Falcon Host" : "Unknown";
};

/*global define,window*/
define([
    'underscore',
    'app/views/Models/TextDisplayControl',
    'views/shared/controls/TextControl',
    'app/views/Models/SingleInputControl',
    'app/views/Models/SingleInputControlEx',
    'views/shared/controls/SyntheticCheckboxControl',
    'views/shared/controls/SyntheticRadioControl',
    'app/views/Models/MultiSelectInputControl',
    'app/models/Input',
    'app/models/Account',
    'app/collections/Inputs'
], function (
    _,
    TextDisplayControl,
    TextControl,
    SingleInputControl,
    SingleInputControlEx,
    SyntheticCheckboxControl,
    SyntheticRadioControl,
    MultiSelectInputControl,
    Input,
    Account,
    Inputs
) {
    return {
        "input": {
           "title": "Input",
           "caption": {
               title: "Inputs",
               description: 'Create data inputs to collect falcon host data from CrowdStrike.',
               enableButton: true,
               singleInput: true,
               buttonId: "addInputBtn",
               buttonValue: "Create New Input",
               enableHr: true
           },
           generateSortHandler: (stateModel) => {
               var sort_dir = stateModel.get('sortDirection'),
                   sort_key = stateModel.get('sortKey'),
                   sort_alphabetical = function (a, b) {
                       var textA = a.entry.content.get(sort_key) ? a.entry.content.get(sort_key).toUpperCase() : '',
                           textB = b.entry.content.get(sort_key) ? b.entry.content.get(sort_key).toUpperCase() : '';
                       if (sort_dir === 'asc') {
                           return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                       }
                       return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                   },
                   sort_numerical = function (a, b) {
                       var numA = a.entry.content.get(sort_key) ? Number(a.entry.content.get(sort_key)) : 0,
                           numB = b.entry.content.get(sort_key) ? Number(b.entry.content.get(sort_key)) : 0;
                       if (sort_dir === 'asc') {
                           return (numA < numB) ? -1 : (numA > numB) ? 1 : 0;
                       }
                       return (numA > numB) ? -1 : (numA < numB) ? 1 : 0;
                   };

               return {
                   'name': function (a, b) {
                       var textA = a.entry.get(sort_key).toUpperCase(),
                           textB = b.entry.get(sort_key).toUpperCase();

                       if (sort_dir === 'asc') {
                           return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                       }
                       return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                   },
                   'index': sort_alphabetical,
                   'interval': sort_numerical,
                   'disabled': function (a, b) {
                       var textA = a.entry.content.get('disabled') ? 1 : 0,
                           textB = b.entry.content.get('disabled') ? 1 : 0;
                       if (sort_dir === 'asc') {
                           return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                       }
                       return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                   },
                   'service': function (a, b) {
                       var textA = a.id.indexOf("ta_crowdstrike_falcon_host_inputs") > -1 ? "falcon host" : "unkonwn";
                           textB = b.id.indexOf("ta_crowdstrike_falcon_host_inputs") > -1 ? "falcon host" : "unknown";
                       if (sort_dir === 'asc') {
                           return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                       }
                       return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                   }
               };
           },
           "header": [
               {
                   "field": "name",
                   "label": "Name",
                   "sort": true,
                   mapping: normalEscape
               },
               {
                   "field": "service",
                   "label": "Service",
                   "sort": true,
                   mapping: model => mappingServiceName(model.id)
               },
                {
                   "field": "account",
                   "label": "Account",
                   "sort":true,
                   mapping: normalEscape
               },
               {
                   "field": "interval",
                   "label": "Interval",
                   "sort": true,
                   mapping: normalEscape
               },
               {
                   "field": "index",
                   "label": "Index",
                   "sort": true,
                   mapping: normalEscape
               },
               {
                   "field": "disabled",
                   "label": "Status",
                   "sort": true,
                   mapping: function (field) {
                       return field ? "Disabled" : "Enabled";
                   }
               }
           ],
           "moreInfo": [
               {
                   "field": "name",
                   "label": "Name",
                   mapping: normalEscape
               },
               {
                   "field": "account",
                   "label": "Account",
                   mapping: normalEscape
               },
               {
                   "field": "start_offset",
                   "label": "Start Offset",
                   mapping: normalEscape
               },
               // Common fields
               {
                   "field": "interval",
                   "label": "Interval",
                   mapping: normalEscape
               },
               {
                   "field": "index",
                   "label": "Index",
                   mapping: normalEscape
               },
               {
                   "field": "disabled",
                   "label": "Status",
                   mapping: function (field) {
                       return field ? "Disabled" : "Enabled";
                   }
               }
           ],
           "services": {
               "input": {
                   "title": "Falcon Host",
                   "model": Input,
                   "url": "",
                   "collection": Inputs,
                   "entity": [
                       {
                           "field": "name",
                           "label": "Name",
                           "type": TextControl,
                           "required": true,
                           "help": "Enter a unique name for each crowdstrike falcon host data input."
                       },
                       {
                           "field": "account",
                           "label": "Account",
                           "type": SingleInputControl,
                           "required": true,
                           "options": {}
                       },
                       {
                           "field": "start_offset",
                           "label": "Start Offset",
                           "type": TextControl,
                           "required": true,
                           "defaultValue": "0"
                       },
                       {
                           "field": "interval",
                           "label": "Interval",
                           "type": TextControl,
                           "required": true,
                           "defaultValue": "60",
                           "help": "Time interval of input in seconds."
                       },
                       {
                           "field": "index",
                           "label": "Index",
                           "type": SingleInputControlEx,
                           "required": true,
                           "defaultValue": "default"
                       }
                   ],
                   "actions": [
                       "edit",
                       "delete",
                       "enable",
                       "clone"
                   ]
               }
           },
           filterKey: ['name', 'service', 'account', 'url', 'start_offset', 'index', 'interval', 'status']
        },

        "account": {
            "model": Account,
            "title": "Crowdstrike Account",
            "header": [
                {
                    "field": "name",
                    "label": "Name",
                    "sort": true,
                    mapping: normalEscape
                },
                {
                    "field": "endpoint",
                    "label": "Endpoint",
                    "sort": true,
                    mapping: normalEscape
                },
                {
                    "field": "api_uuid",
                    "label": "API UUID",
                    "sort": true,
                    mapping: normalEscape
                }
            ],
            "entity": [
                {
                    "field": "name",
                    "label": "Name",
                    "type": TextControl,
                    "required": true,
                    "help": "Enter a unique name for each Crowdstrike falcon host account."
                },
                {
                    "field": "endpoint",
                    "label": "Endpoint",
                    "type": TextControl,
                    "required": true,
                    "defaultValue":"https://firehose.crowdstrike.com/sensors/entities/datafeed/v1",
                    "options": {
                        "enabled": false,
                        "placeholder": "https://firehose.crowdstrike.com/sensors/entities/datafeed/v1"
                    }
                },
                {
                    "field": "api_uuid",
                    "label": "API UUID",
                    "type": TextControl,
                    "required": true
                },
                {
                    "field": "api_key",
                    "label": "API Key",
                    "type": TextControl,
                    "required": true,
                    "encrypted": true
                }
            ],
            "refLogic": function (model, refModel) {
                return model.entry.attributes.name === refModel.entry.content.attributes.server;
            },
            "actions": [
                "edit",
                "delete",
                "clone"
            ],
            "tag": "server"
        },

        "proxy": {
            "title": "Proxy",
            "entity": [
                {"field": "proxy_enabled", "label": "Enable", "type": SyntheticCheckboxControl},
                {
                    "field": "proxy_type",
                    "label": "Proxy Type",
                    "type": SingleInputControl,
                    "options": {
                        "disableSearch": true,
                        "autoCompleteFields": [
                            {"label": "http", "value": "http"},
                            {"label": "socks4", "value": "socks4"},
                            {"label": "socks5", "value": "socks5"}
                        ]
                    },
                    "defaultValue": "http"
                },
                {"field": "proxy_url", "label": "Host", "type": TextControl},
                {"field": "proxy_port", "label": "Port", "type": TextControl},
                {"field": "proxy_username", "label": "Username", "type": TextControl},
                {
                    "field": "proxy_password",
                    "label": "Password",
                    "type": TextControl,
                    "encrypted": true,
                    "associated": "username"
                }
            ]
        },
        "logging": {
            "entity": [
                {
                    "field": "loglevel",
                    "label": "Log Level",
                    "type": SingleInputControl,
                    "options": {
                        "disableSearch": true,
                        "autoCompleteFields": [
                            {"label": "INFO", "value": "INFO"},
                            {"label": "DEBUG", "value": "DEBUG"},
                            {"label": "ERROR", "value": "ERROR"}
                        ]
                    },
                    "defaultValue": "INFO"
                }
            ]
        }
    };
});
