function addStudentsTotheGroup(studentIds: Array<string | number>, groupId: string) {
        
        return fetch(`http://localhost:8080/groups/${groupId}/students?ids=${studentIds.join()}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {            
            'Content-Type': 'application/json;charset=utf-8'
        }
    })    
}

export {addStudentsTotheGroup};