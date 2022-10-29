import { Student } from '../App'  

function addStudent(newData: Student) {
    const jsonData = JSON.stringify(newData)
    console.log(jsonData);
    return fetch('http://localhost:8080/students', {
        method: 'POST',        
        body: jsonData,
        headers: {            
            'Content-Type': 'application/json;charset=utf-8'
        }
    })    
}

export {addStudent};