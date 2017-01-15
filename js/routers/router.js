define([
    'jquery',
    'backbone',
    'collections/todos',
    'common/values'
], function ($, Backbone, Todos, Values) {
    'use strict';

    var TodoRouter = Backbone.Router.extend({
        // Defines the application routes
        routes: {
            '*filter': 'setFilter'
        },
        // Set the filter value and trigger the filter event to be emitted on the todo collection.
        setFilter: function (param) {
            Values.filter = param || '';

            Todos.trigger('filter');
        },
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(TodoRouter.prototype.meta, 'className', {
        value: 'TodoRouter'
    });

    // app.TodoRouter = new TodoRouter();
    return TodoRouter;
    //??? start recording? Doc this
    // Backbone.history.start();

});
