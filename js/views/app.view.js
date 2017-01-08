var app = app || {};

(function () {
    'use strict';

    var KEYS = app.const.KEYS;
    var ID = app.const.ID;

    /**
     * Handles rendering of the initial todo and creating additinoal todos.
     */
    app.AppView = Backbone.View.extend({
        // bind to an existing element
        el: '[data-hook="todo-app"]',
        // template for the stats at the bottom of the app
        // statsTemplate: _.template( $('#stats-template').html() ),
        statsTemplate: Handlebars.compile($('#stats-template').html()),
        // Delegated DOM triggered events
        events: {
            'keypress #new-todo': 'createOnEnter',
            'click #clear-complete': 'clearComplete',
            // 'click [data-hook="toggle-all"]': 'toggleAllComplete'
        },
        // initialization and setup
        initialize: function () {
            // events.call(this);
            // this.$() finds elements relative to this.$el
            // this.allCheckbox = this.$('[data-hook="toggle-all"]')[0];
            this.$input = this.$('#new-todo');
            this.$footer = this.$('#footer');
            this.$main = this.$('#main');
            this.$list = $('#todo-list');

            // listenTo() implicitly sets the callback’s context to the view when it creates the binding
            // ??? should this be located here or on the collection object?
            this.listenTo(app.todos, 'add', this.addOne);
            this.listenTo(app.todos, 'reset', this.addAll);
            this.listenTo(app.todos, 'change:complete', this.filterOne);
            this.listenTo(app.todos, 'filter', this.filterAll);
            this.listenTo(app.todos, 'all', _.debounce(this.render, 0)); //TODO: why debounce?

            //TODO: Doc this
            app.todos.fetch({ reset: true });
        },
        // render the application
        // If todos exist, show the #main & #footer sections
        //      populate the footer with statistics
        //      stylize the todo items
        //      update the `allCheckbox`
        render: function () {
            var complete = app.todos.complete().length;
            var remaining = app.todos.remaining().length;

            if (app.todos.length) {
                this.$footer.show();

                this.$footer.html(this.statsTemplate({
                    complete: complete,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#/' + (app.TodoFilter || '') + '"]')
                    .addClass('selected');
            } else {
                this.$footer.hide();
            }

            // this.allCheckbox.checked = !remaining;
        },
        // add a single todo to the list of todos.
        // creates a view and appends to the end of the todos view
        addOne: function (todo) {
            var view = new app.TodoView({ model: todo });
            $(ID.todoList).append(view.render().el);
        },
        // add all todos to the collection of todos
        addAll: function () {
            this.$(ID.todoList).html(''); // set the html to an empty block
            app.todos.each(this.addOne, this);
        },
        //
        filterOne: function (todo) {
            todo.trigger('visible');
        },
        filterAll: function () {
            app.todos.each(this.filterOne, this);
        },
        // generate properties for a new todo
        // used by createOnEnter -- should be made private
        newAttributes: function () {
            return {
                title: this.$input.val().trim(),
                order: app.todos.nextOrder(),
                complete: false
            };
        },
        // create a new todo when the enter key is pressed from within the todo input field.
        // reset the input field to an empty slate.
        createOnEnter: function (event) {
            if (event.which === KEYS.ENTER_KEY && this.$input.val().trim()) {
                app.todos.create(this.newAttributes());
                this.$input.val('');
            }
        },
        // clear all complete todos and destory their associated models.
        clearComplete: function () {
            _.invoke(app.todos.complete(), 'destroy');
            return false;
        },
        toggleAllComplete: function () {
            var complete = this.allCheckbox.checked;

            app.todos.each(function (todo) {
                todo.save({
                    complete: complete
                });
            });
        },
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(app.AppView.prototype.meta, 'className', {
        value: 'AppView'
    });

    // function events() {
    // listenTo() implicitly sets the callback’s context to the view when it creates the binding
    //     this.listenTo(app.todos, 'add', this.addOne);
    //     this.listenTo(app.todos, 'reset', this.addAll);
    // }

})();

