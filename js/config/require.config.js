'use strict'; // eslint-disable-line

// require.config({
//     // deps: '../app',
//     // sets up custom paths to common libraries, plugins, modules.
//     paths: {
//         'underscore': '../lib/udnerscore',
//         'jquery': '../lib/jquery.slim.min',
//         'backbone': '../lib/backbone.min',
//         'backbone-nested': '../lib/backbone-nested',
//         'backbone-localstorage': 'js/lib/backbone.localstorage',
//         'handlebars': '../lib/handlebars.min',
//         'text': '../lib/text'
//     },
//     // ! refer to custom path.
//     shim: {
//         'underscore': {
//             exports: '_'
//         },
//         'backbone': {
//             deps: ['jquery', 'underscore'],
//             exports: 'Backbone'
//         },
//         'localstorage': {
//             deps: ['backbone']
//         },
//         'backbone-nested': {
//             deps: ['backbone']
//         }
//     }
// });
// require([
//     'backbone',
//     'views/app.view',
//     'routers/router'
// ], function (Backbone, AppView, Router) {
//     'use strict';

//     // Initialize routing and start tracing browser history
//     new Router();
//     Backbone.history.start();

//     // Initialize the application view
//     new AppView();
// });