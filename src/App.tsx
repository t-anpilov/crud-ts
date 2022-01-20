import React, { useState, useEffect } from 'react';
import { getStudents } from './GetStudents';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import StudentsList from './components/StudentsList'
 
export interface Product {
    id: string | number;
    firstName: string;
    lastName: string;
    middleName: string;
    photoId?: string | null;
    gender: string;
    dateOfBirth: Date | Date[];
    insurance?: boolean;
    school?: string;
    shift?: Shifts;
    groups?: Group[]
}

export type Group = {id: string | number, groupDescription: string}
export type Shifts = "FIRST" | "SECOND" | ""

const App: React.FC = () => {    

    const [studentsData, setStudentsData] = useState<Product[]>([]);
    

    useEffect(() => {
        getStudents().then(data => setStudentsData(data));
    }, []);

    return (
        <div>
           <StudentsList students={studentsData} />
        </div>  
    );
}

export default App;