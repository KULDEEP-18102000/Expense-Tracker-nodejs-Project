"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos = [];
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toString(),
        text: body.text
    };
    todos.push(newTodo);
    res.status(200).json(todos);
});
router.delete('/todo/:id', (req, res, next) => {
    try {
        const params = req.params;
        const id = params.id;
        let todo = null;
        for (let index = 0; index < todos.length; index++) {
            if (todos[index].id === id) {
                todo = todos[index];
                todos.splice(index);
                res.status(200).json({ message: "successfully deleted" });
            }
        }
        if (todo === null) {
            res.status(404).json({ message: "wrong id" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
router.put('/todo/:id', (req, res, next) => {
    try {
        const params = req.params;
        const id = params.id;
        let todo = null;
        for (let index = 0; index < todos.length; index++) {
            if (todos[index].id === id) {
                todo = todos[index];
                todos[index].text = req.body.text;
                res.status(200).json({ message: "successfully updated" });
            }
        }
        if (todo === null) {
            res.status(404).json({ message: "wrong id" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
