import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Student, Group } from '../App'
import { getGroups } from '../models/getGroups' 


type AddToGroupProps = { 
    isVisible: boolean;
    hideDialog: (studentsID: Array<string | number>, groupID: string) => void;
    student: Student
}

const AddToGroupDialog: React.FC<AddToGroupProps> = props => {

    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [selectedGroupID, setSelectedGroupID] = useState('');
    const [studentsList, setStudentsList] = useState<Array<string | number>>([]);
    
    useEffect(() => {
        getGroups().then(data => setGroupsList(data));
    }, [])

    const onGroupSelect = (e: DropdownChangeParams) => {        
        let studentID: Array<string | number> = []
        if(props.student.id) studentID.push(props.student.id)
        setStudentsList(studentID)
        const groupID = e.target.value.id
        setSelectedGroupID(groupID)
        //addStudentsTotheGroup(studentID, groupID)
    }

    const filterGroup = (arr1: Group[], val: string | number) => {
        let result: boolean
        return result = !arr1.some(item => item.id === val)
    }

    const getAvaliableGroups = () => {
        let avaliableGroups : Group[] = []
        let options: Object[] = []
         
        if (!props.student.groups) {
            avaliableGroups = [...groupsList];
        } else {
            groupsList.forEach(group => {
                if(props.student.groups && group.id && filterGroup(props.student.groups, group.id)) {
                    avaliableGroups.push(group);
                }
            });
        };
        avaliableGroups.forEach(group => options.push({name: group.groupDescription, id: group.id}))
        return options
    };
    

    return (
        <Dialog
            visible = {props.isVisible}
            breakpoints={{'720px': '75vw', '480px': '100vw'}} 
            style={{width: '40vw'}} 
            header="Add Student To The Group" 
            modal className="p-fluid" 
            onHide={() => props.hideDialog(studentsList, selectedGroupID)}
        >
            <div className="field col">
                <label htmlFor="shift" className="titles">Select a group</label>
                    <Dropdown 
                        id="groupSelect"  
                        optionLabel="name"
                        options={getAvaliableGroups()}
                        onChange={e => onGroupSelect(e)}
                        placeholder='Select a shift' />
            </div> 
        </Dialog>
    )
};

export default AddToGroupDialog