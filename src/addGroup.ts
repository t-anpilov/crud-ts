import { Group } from './App'  

function addGroup(newData: Group) {
    const jsonData = JSON.stringify(newData)
    console.log(jsonData);
    return fetch('http://localhost:8080/groups', {
        method: 'POST',        
        body: jsonData,
        headers: {            
            'Content-Type': 'application/json;charset=utf-8'
        }
    })    
}

export {addGroup};