function getStudents() {
    return fetch('http://localhost:8080/students', {
        method: 'GET',
        mode: 'cors'})    
    .then(res => res.json())
    .then(d =>  {
        console.log(d.content);
        return d.content;
    })
}

export {getStudents};