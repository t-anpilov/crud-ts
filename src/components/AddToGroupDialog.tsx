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
    hideDialog: (studentID: string | number, groupID?: string, groupName?: string) => void;
    student: Student;
}

const AddToGroupDialog: React.FC<AddToGroupProps> = props => {

    const emptyGroup: Group = {groupDescription: ''}
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [groupOptions, setGroupOptions] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group>(emptyGroup);
    const [studentID, setStudentID] = useState<string | number>('');
    
    useEffect(() => {
        getGroups().then(data => setGroupsList(data));
    }, [])

    useEffect(() => {
        if(props.student.id) setStudentID(props.student.id);
    }, [])

    const onGroupSelect = (e: DropdownChangeParams) => { 
        const value: Group = e.target && e.target.value;
        let _group = {...selectedGroup};        
        _group.id = value.id;
        _group.groupDescription = value.groupDescription;    
        setSelectedGroup(_group);  
    }

    const filterGroup = (arr1: Group[], val: string | number) => {
        let result: boolean
        return result = !arr1.some(item => item.id === val)
    }

    const getAvaliableGroups = () => {
        let avaliableGroups : Group[] = []
         
        if (!props.student.groups) {
            avaliableGroups = [...groupsList];
        } else {
            groupsList.forEach(group => {
                if(props.student.groups && group.id && filterGroup(props.student.groups, group.id)) {
                    avaliableGroups.push(group);
                }
            });
        };        
        setGroupOptions([...avaliableGroups]);
    };

    return (
        <Dialog
            visible = {props.isVisible}
            breakpoints={{'720px': '75vw', '480px': '100vw'}} 
            style={{width: '40vw'}} 
            header="Add Student To The Group" 
            modal className="p-fluid" 
            onHide={() => props.hideDialog(studentID, selectedGroup.id?.toString(), selectedGroup.groupDescription)}
            onShow={() => getAvaliableGroups()}
        >
            <div className="field col">
                <label htmlFor="shift" className="titles">Select a group</label>
                    <Dropdown 
                        id="groupSelect"  
                        optionLabel="groupDescription"
                        options={groupOptions}
                        value={selectedGroup}
                        onChange={e => onGroupSelect(e)}
                        placeholder='Select a group' />
            </div> 
        </Dialog>
    )
};

export default AddToGroupDialog