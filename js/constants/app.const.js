define([], function () {
    'use strict';

    /**
     * "should" represent immutable constants used throughout the application.
     * These values should not be modified!
     */
    var constants = {
        // applciation specific html id attr. values
        ID: {
            todoList: '#todo-list'
        },
        // Keyboard actions.
        KEYS: {
            ENTER_KEY: 13
        }
    };

    return constants;

});
