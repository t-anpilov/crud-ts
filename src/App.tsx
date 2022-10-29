import React, { useState, useEffect } from 'react';
import { DataTableSelectParams } from 'primereact/datatable';
import { getStudents } from './models/GetStudents';
import { getGroups, getGroupsMembers } from './models/getGroups'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import StudentsList from './components/StudentsList'
import GroupsList from './components/GroupsList';
import './app.css';

 
export interface Student {
    id?: string | number;
    firstName: string;
    lastName: string;
    middleName: string;
    photoId?: string | null;
    gender?: string;
    dateOfBirth?: Date | Date[];
    insurance?: boolean | null;
    school?: string;
    shift?: Shifts;
    groups?: Group[]
};

export type Group = {
    id?: string | number,
    groupDescription: string,
    members?: Student[]
};

export type Shifts = "FIRST" | "SECOND" | ""  ;

const App: React.FC = () => {    

    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [groupsData, setGroupsData] = useState<Group[]>([]);
    const [currentGroupName, setCurrentGroupName] = useState<string>();
    const [isGroupSelected, setIsGroupSelected] = useState<Boolean>(false);
    
    useEffect(() => {
        getGroups().then(data => setGroupsData(data));
    }, [])

    useEffect(() => {
        getStudents().then(data => setStudentsData(data));
    }, []);

    const studentsListHandler = (e: DataTableSelectParams) => {
        
        getGroupsMembers(e.data.id)
        .then(groupData => {
            setStudentsData(groupData) 
        })
        setIsGroupSelected(true)
        setCurrentGroupName(e.data.groupDescription)
        
    }

    const studentsAllListHandler = () => {
        getStudents().then(data => setStudentsData(data)) 
        setIsGroupSelected(false)
        setCurrentGroupName('')        
    }  
    
    const updateStudentsListHandler = () => {
        getStudents().then(data => setStudentsData(data))
    };

    const updateGroupsListHandler = () => {
        getGroups().then(data => setGroupsData(data))
    };

    return (
                
        <div className="flex_container">
            <GroupsList 
                groups={groupsData} 
                showMembersAtList={studentsListHandler}
                showAllMembersAtList={studentsAllListHandler}
                someGroupSelected = {isGroupSelected}
                updateList = {updateGroupsListHandler}
            />
            <StudentsList 
                students={studentsData} 
                groupName={currentGroupName} 
                isGroupName = {isGroupSelected}
                updateList = {updateStudentsListHandler}
            />
            
        </div>
    );
}

export default App;