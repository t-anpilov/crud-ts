function removeStudent(id: string | number) {
    console.log(id)
    return fetch(`http://localhost:8080/students/${id}`, { 
        method: 'DELETE',
        headers: {           
            'Content-Type': 'application/json'
        },
        body: null
    } )

   
   .then(data => {
    console.log('DELETED: ', data);
        
   } )
    
}


export {removeStudent};