import { Router } from "express";
import { type } from "os";

import { Todo } from "../models/todo";

type RequestBody={text:string}
type RequestParams={id:string}

const todos: Todo[]=[]

const router=Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({todos:todos})
})

router.post('/todo',(req,res,next)=>{
    const body=req.body as RequestBody
    const newTodo: Todo={
        id:new Date().toString(),
        text:body.text
    };

    todos.push(newTodo)
    res.status(200).json(todos)
})

router.delete('/todo/:id',(req,res,next)=>{
    try {
        const params=req.params as RequestParams
        const id=params.id
        let todo=null
        for (let index = 0; index < todos.length; index++) {
            if(todos[index].id===id){
                todo=todos[index]
                todos.splice(index)
                res.status(200).json({message:"successfully deleted"})
            }
            
        }
        if(todo===null){
            res.status(404).json({message:"wrong id"})
        }
    } 
    catch(error){
        console.log(error)
    }
})

router.put('/todo/:id',(req,res,next)=>{
    try {
        const params=req.params as RequestParams
        const id=params.id
        let todo=null
        for (let index = 0; index < todos.length; index++) {
            if(todos[index].id===id){
                todo=todos[index]
                todos[index].text=req.body.text
                res.status(200).json({message:"successfully updated"})
            }
            
        }
        if(todo===null){
            res.status(404).json({message:"wrong id"})
        }
    } 
    catch(error){
        console.log(error)
    }
})

export default router