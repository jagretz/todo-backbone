var app = app || {};

(function(){
    'use strict';

    var TodoRouter = Backbone.Router.extend({
        // Defines the application routes
        routes: {
            '*filter': 'setFilter'
        },
        // Set the filter value and trigger the filter event to be emitted on the todo collection.
        setFilter: function (param) {
            app.TodoFilter = param || '';

            app.todos.trigger('filter');
        },
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(TodoRouter.prototype.meta, 'className', {
        value: 'TodoRouter'
    });

    app.TodoRouter = new TodoRouter();

    //??? start recording? Doc this
    Backbone.history.start();

})();
