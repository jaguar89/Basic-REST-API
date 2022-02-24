const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());

const courses = [
    {id:1 , name : 'course1'},
    {id:2 , name : 'course2'},
    {id:3 , name : 'course3'},
];

const schema = Joi.object({
    name : Joi.string().required().min(3)
});

function validateCourse(course){
    return schema.validate(course);
}

app.get('/', (req, res)=>{ 
  res.send('hello, world!');
});

app.get('/api/courses', (req,res)=>{
  res.send(courses);
});

app.get('/api/courses/:id' , (req,res)=>{
     const course = courses.find(e => e.id === parseInt(req.params.id));
     if(!course){
         return res.status(404).send('No such course in our server!');
     }
     res.send(course); 
});

app.post('/api/courses' , (req,res)=>{

    const {error} = validateCourse(req.body);
    if(error){
       return res.send(error.details[0].message);
    }
    const course = {
     id : courses.length + 1 ,
     name : req.body.name
    };

    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id' , (req,res)=>{
    const course = courses.find(e=>e.id === parseInt(req.params.id));
    if(!course){
     return res.status(404).send('Not Found!');
    }

    const {error} = validateCourse(req.body);
    if(error){
        return res.send(error.details[0].message);
     }
     
     course.name = req.body.name;
     res.send(course);
});

app.delete('/api/courses/:id' ,(req,res)=>{
   const course = courses.find(e => e.id === parseInt(req.params.id));
   if(!course){
    return res.status(404).send('can\'t perform delete becuze no file was found!');
   }
   let index = courses.indexOf(course);
   courses.splice(index ,1);
   res.send(course);
});

const port = process.env.PORT || 3000 ;
app.listen(port , ()=> console.log(`server running on port ${port}...`));
