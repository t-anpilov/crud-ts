function getGroups() {
    return fetch('http://localhost:8080/groups', {
        method: 'GET',
        mode: 'cors'})    
    .then(res => res.json())
    .then(d => d.content)
}

function getGroupsMembers(id: string | number) {
    return fetch(`http://localhost:8080/groups/${id}/students`, {
        method: 'GET',
        mode: 'cors'})    
    .then(res => res.json())
    .then(d => d.content)
}

export {getGroups, getGroupsMembers};