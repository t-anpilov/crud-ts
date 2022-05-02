function getStudents() {
    return fetch('http://localhost:8080/students', {
        method: 'GET',
        mode: 'cors'})    
    .then(res => res.json())
    .then(d => d.content)
}

function getStudentDetails (id: string | number) { 
    return fetch(`http://localhost:8080/students/${id}`,{ method: 'GET', mode: 'cors'})
   .then(res => res.json())
   .then(data => {
    console.log('request', data);
    return data;
   } )  

}

export {getStudents, getStudentDetails};