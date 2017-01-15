define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'collections/todos',
    'views/todo.view',
    'text!templates/stats.html',
    'constants/app.const',
    'common/values'
], function ($, _, Backbone, Handlebars, Todos, TodoView, statsTemplate, Constants, Values) {
    'use strict';

    var KEYS = Constants.KEYS;
    var ID = Constants.ID;

    /**
     * Handles rendering of the initial todo and creating additinoal todos.
     */
    var AppView = Backbone.View.extend({
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
            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'change:complete', this.filterOne);
            this.listenTo(Todos, 'filter', this.filterAll);
            this.listenTo(Todos, 'all', _.debounce(this.render, 0)); //TODO: why debounce?

            //TODO: Doc this
            Todos.fetch({ reset: true });
        },
        // render the application
        // If todos exist, show the #main & #footer sections
        //      populate the footer with statistics
        //      stylize the todo items
        //      update the `allCheckbox`
        render: function () {
            var complete = Todos.complete().length;
            var remaining = Todos.remaining().length;

            if (Todos.length) {
                this.$footer.show();

                this.$footer.html(this.statsTemplate({
                    complete: complete,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#/' + (Values.filer || '') + '"]')
                    .addClass('selected');
            } else {
                this.$footer.hide();
            }

            // this.allCheckbox.checked = !remaining;
        },
        // add a single todo to the list of todos.
        // creates a view and appends to the end of the todos view
        addOne: function (todo) {
            var view = new TodoView({ model: todo });
            $(ID.todoList).append(view.render().el);
        },
        // add all todos to the collection of todos
        addAll: function () {
            this.$(ID.todoList).html(''); // set the html to an empty block
            Todos.each(this.addOne, this);
        },
        //
        filterOne: function (todo) {
            todo.trigger('visible');
        },
        filterAll: function () {
            Todos.each(this.filterOne, this);
        },
        // generate properties for a new todo
        // used by createOnEnter -- should be made private
        newAttributes: function () {
            return {
                title: this.$input.val().trim(),
                order: Todos.nextOrder(),
                complete: false
            };
        },
        // create a new todo when the enter key is pressed from within the todo input field.
        // reset the input field to an empty slate.
        createOnEnter: function (event) {
            if (event.which === KEYS.ENTER_KEY && this.$input.val().trim()) {
                Todos.create(this.newAttributes());
                this.$input.val('');
            }
        },
        // clear all complete todos and destory their associated models.
        clearComplete: function () {
            _.invoke(Todos.complete(), 'destroy');
            return false;
        },
        toggleAllComplete: function () {
            var complete = this.allCheckbox.checked;

            Todos.each(function (todo) {
                todo.save({
                    complete: complete
                });
            });
        },
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(AppView.prototype.meta, 'className', {
        value: 'AppView'
    });

    return AppView;

    // function events() {
    // listenTo() implicitly sets the callback’s context to the view when it creates the binding
    //     this.listenTo(app.todos, 'add', this.addOne);
    //     this.listenTo(app.todos, 'reset', this.addAll);
    // }

});

