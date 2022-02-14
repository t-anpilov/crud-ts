import React, { useState, useRef, FormEvent } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Student } from '../App'  
import StudentDetails from './StudentDetails'
import { getStudents, getStudentDetails } from '../GetStudents'
import { addStudent } from '../addStudents'

interface StudentsListProps {
    students: Student [];
    groupName?: string;
    isGroupName: Boolean;
    refreshAll: () => void
}

const createId = async () => {
    let id:string | number = '';
    /*let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 2; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }*/    
    let idArray: Array<string | number> = []
    const array: Student [] = await getStudents()
    array.map((item:Student) => idArray.push(item.id));
    id = +idArray[idArray.length-1] + 1;        
    return id    
}

export const emptyStudent: Student = {
    id: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    photoId: null,
    insurance: null,
    school: '',
    shift: '',
    groups: []

};

const StudentsList: React.FC<StudentsListProps> = props => {
    

    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [deleteStudentsDialog, setDeleteStudentsDialog] = useState(false);  
    const [student, setStudent] = useState<Student>(emptyStudent);
    const [currentStudent, setCurrentStudent] = useState<Student>(emptyStudent)
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [noEdit, setNoEdit] = useState(true);
    const [submitted, setSubmitted] = useState(false); // not sure if I'll use it
    const [globalFilter, setGlobalFilter] = useState<string>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable>(null);
    
    
    const openNew = () => {
        let _currentStudent = {...emptyStudent}
        setCurrentStudent({..._currentStudent}); 
        setSubmitted(false);
        setStudentDialog(true);
    } 
    const allowEditHandler = () => {        
        setNoEdit(false)
    }

    const hideDialogHandler = () => {
        setStudentDialog(false)
        setSubmitted(false);                
        setNoEdit(true);
    } 

    const checkOf = (unchecked: Student) => {
        if (
            unchecked.firstName.trim() &&
            unchecked.lastName.trim() &&
            unchecked.middleName.trim() &&
            unchecked.school && unchecked.school.trim() &&
            unchecked.dateOfBirth &&
            unchecked.shift &&
            unchecked.gender
        ) return true
        else return false
    }

    const hideAndSaveDialogHandler = async (studentData: Student) => {
        if (checkOf(studentData)) {
            setStudentDialog(false)
        setSubmitted(false);                
        setNoEdit(true);
        studentData.id = await createId();            
        addStudent(studentData);
        props.refreshAll();
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: `Student ${studentData.firstName} added`, life: 3000 });
        } else {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields', life: 3000 });
        }
        
    }    

    const hideDeleteStudentDialog = () => {
        setDeleteStudentDialog(false);
    }

    const hideDeleteStudentsDialog = () => {
        setDeleteStudentsDialog(false);
    }   
    
    const editStudent = async (student: Student) => {  
        let _currentStudent = await getStudentDetails(student.id)
        setCurrentStudent({..._currentStudent});        
        setStudentDialog(true);
    }
    

    const confirmDeleteStudent = (student: Student) => {
        setStudent(student);
        setDeleteStudentDialog(true);
    }
  // q if we need
    const deleteStudent = () => {
        let _students : Student []
        if (Array.isArray(props.students)) {
            _students = props.students.filter((val: { id: string | number; }) => val.id !== student.id);
            setStudentsList(_students); 
        setDeleteStudentDialog(false);
        setStudent(emptyStudent);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student Removed', life: 3000 });
        } 
    }

    const confirmDeleteSelected = () => {
        setDeleteStudentsDialog(true);
    }

    const deleteSelectedStudents = () => {
        let _students : Student []
        if (Array.isArray(props.students)) {
            _students = props.students.filter((val: Student) => !selectedStudents.includes(val));
            setStudentsList(_students);
            setDeleteStudentsDialog(false);
            setSelectedStudents([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
        }
        console.log (studentsList) // checking remove function
    }    

    const nameBodyTemplate = (rowData: Student) => {
        if(rowData.firstName && rowData.lastName && rowData.middleName) {
            return <span> {`${rowData.lastName} ${rowData.firstName} ${rowData.middleName}`} </span>
        }  
    }

    /*const addZero = (num: number) => {
        if (num < 10) {
            return '0' + num 
        }
         return num        
    }*/

    const dateBodyTemplate = (rowData: Student) => {
        if (rowData.dateOfBirth && !Array.isArray(rowData.dateOfBirth)) {            
            let date: Date = new Date(rowData.dateOfBirth)
            let currentDate = new Date()
            return Math.floor((+currentDate - +date) / 31536000000)

            //formatting date
           /* let dateArr = [addZero(date.getDate()), addZero(date.getMonth()+1), date.getFullYear()]
            return <span> {`${dateArr[0]}.${dateArr[1]}.${dateArr[2]}`} </span>
            */
        } 
    }

    const genderBodyTemplate = (rowData: Student) => {
        if (rowData.gender) {
            let text = rowData.gender
            return <span> {text[0] + text.slice(1).toLowerCase()} </span>
        } 
    }

    // there is action to open details
    const actionBodyTemplate = (rowData: Student) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStudent(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteStudent(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
            <span className="p-input-icon-left w-full md:w-auto">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: FormEvent<HTMLInputElement>) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." className="w-full lg:w-auto" />
            </span>
            <div className="mt-3 md:mt-0 flex justify-content-end">
                <Button icon="pi pi-plus" className="mr-2 p-button-rounded" onClick={openNew} tooltip="New" tooltipOptions={{position: 'bottom'}} />
                <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedStudents || !selectedStudents.length} tooltip="Delete" tooltipOptions={{position: 'bottom'}} />
                
            </div>
        </div>
    );    

    const deleteStudentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStudentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteStudent} />
        </React.Fragment>
    );

    const deleteStudentsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStudentsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedStudents} />
        </React.Fragment>
    );

    
    

    return (
        <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
            <Toast ref={toast} />

            <div className="text-3xl text-800 font-bold mb-4">STUDENTS
                {props.isGroupName &&  <span>{`  (${props.groupName})`}</span> }
            </div>

            
            <DataTable ref={dt} value={ props.students} selection={selectedStudents} onSelectionChange={(e) => setSelectedStudents(e.value)}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll"
                onRowDoubleClick={(e) => editStudent(e.data)}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                
                <Column field="fullname" sortField="lastName" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>                
                <Column field="dateOfBirth" header="Age" body={dateBodyTemplate} sortable style={{ minWidth: '4rem' }}></Column> 
                <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: '6rem' }}></Column>
                                
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem', textAlign: 'right' }} bodyClassName='right_control'></Column>
            </DataTable>

            {currentStudent && <StudentDetails 
                isVisible={studentDialog}
                studentDetailedData={currentStudent}
                noEditMode={noEdit} 
                hideDialog={hideDialogHandler}
                hideAndSaveDialog={hideAndSaveDialogHandler} 
                allowEdit={allowEditHandler}/>
                
            }            
            
            <Dialog visible={deleteStudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentDialogFooter} onHide={hideDeleteStudentDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {student && <span>Are you sure you want to remove?<b>{student.firstName + student.lastName}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteStudentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentsDialogFooter} onHide={hideDeleteStudentsDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {student && <span>Are you sure you want to remove the selected students?</span>}
                </div>
            </Dialog>   
        </div>
    );
}

export default StudentsList;