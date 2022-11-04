import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Calendar, CalendarChangeParams } from 'primereact/calendar'
import { RadioButton, RadioButtonChangeParams  } from 'primereact/radiobutton'
import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils'; 
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Student, Shifts } from '../App' ;
import AddToGroupDialog from './AddToGroupDialog'
import { addStudentsTotheGroup } from '../models/addToTheGroup'


type StudentDetailsProps = { 
    isVisible: boolean;
    noEditMode: boolean;
    hideDialog: () => void;
    hideAndSaveDialog: (studentInfo: Student) => void;
    allowEdit: () => void;
    studentDetailedData: Student
}

const StudentDetails: React.FC<StudentDetailsProps> = props => {
      
    const [student, setStudent] = useState<Student>(props.studentDetailedData);
    const [addToGroup, setAddToGroup] = useState(false);   
    const [currentGroups, setCurrentGroups] = useState<String[]>([]);
    const toast = useRef<Toast>(null);
    
    
    useEffect(() => {
       setStudent(props.studentDetailedData);
    }, [props.studentDetailedData])

    useEffect(() => {
        const groupsList : String[] = [];
        if (props.studentDetailedData.groups) {
            props.studentDetailedData.groups.map(group => groupsList.push(group.groupDescription));
            setCurrentGroups(groupsList);
        }        
     }, [props.studentDetailedData.groups])
   

    /*const findIndexById = (id: string | number) => {
        let index = -1;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }*/  


    const onGenderSet = (e: RadioButtonChangeParams) => {
        let _student = {...student};
        _student['gender'] = e.value;
        setStudent(_student);
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>, prop: 'firstName'|'lastName'|'middleName') => {
        const val = (e.target && e.target.value) || '';
        let _student: Student = {...student};
        if (prop === 'firstName') {
            _student.firstName = val;
        } else if (prop === 'lastName') {
            _student.lastName = val;
        } else if (prop === 'middleName') {
            _student.middleName = val;
        }    
        setStudent(_student);
    } 
    
    const getNumber = (str: string):number => {
        let num: number = 0
        let res: number
        for (let i=0; i<str.length; i++) {
            if(!isNaN(Number(str[i]))) {
               num = i  
               break              
            }
        }
        res = parseInt( str.slice(num) )
        if (!isNaN(res)) return res
        return 0   
    } 
    
    const onSchoolChange = (e: InputNumberChangeParams) => {
        const val = e && e.value;
        let _student = {...student};
        _student.school =  '#' + val;
        setStudent(_student);
    }

    const onDateChange = (e: CalendarChangeParams) => {
        if (e.target.value!==null)   {
            const val = (e.target && e.target.value);
            let _student = {...student};
            if (val) _student.dateOfBirth = val;
            setStudent(_student);
        }  
    }

    const ShiftOptions: Shifts[] = ["FIRST", "SECOND"]

    const onShiftChange = (e: DropdownChangeParams) => {
        const val = e.target && e.target.value;
        let _student = {...student};        
        _student.shift = val;   
        setStudent(_student);        
    }

    const onInsuranceChange = (e: RadioButtonChangeParams) => {
        let _student = {...student};
        let val = parseInt(e.value)
        _student.insurance = !!val 
        setStudent(_student);
    } 

    const addToGroupHandler = async (studentID: string | number, groupID?: string, groupName?: string) => {
        if (typeof groupID !== 'undefined' && groupID !== null) {
            let idArray = []
            idArray.push(studentID)          
            await addStudentsTotheGroup(idArray, groupID);
            setAddToGroup(false);            
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Successful', 
                detail: `Student ${student.firstName} ${student.lastName} added to the group '${groupName}'`, 
                life: 3000 
            }); 
        } else if (!groupID) {
            alert('No more avaliable groups for this student')
            setAddToGroup(false)
        }  
    }

    const studentDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
            {props.noEditMode && <Button label="Edit" icon="pi pi-check" onClick={props.allowEdit} />}
            {!props.noEditMode && <Button label="Save" icon="pi pi-check" onClick={() => props.hideAndSaveDialog(student)} />} 
        </React.Fragment>
    );

    const groupsList = (
        <React.Fragment>
            {currentGroups && currentGroups.length>0 && <div className='col'>
                <label className='titles'> List of groups: </label>
                <ul className='col-12'>
                    { currentGroups.map( groupName => {
                        return  <li  key={Math.random().toString()}>
                            {groupName}
                        </li>
                    }) }    
                </ul>
            </div>}
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={props.isVisible} 
            breakpoints={{'960px': '75vw', '640px': '100vw'}} 
            style={{width: '40vw'}} 
            header="Student Profile" 
            modal className="p-fluid" 
            footer={studentDialogFooter} 
            onHide={props.hideDialog}
            >
                <Toast ref={toast} />
                {student.photoId && <img 
                    src={`demo/images/${student.photoId}`} 
                    alt={student.photoId} 
                    className="block mt-0 mx-auto mb-5 w-12rem shadow-2" 
                />}
                {student.photoId===null && <img 
                    src='demo/images/avatar2.png' 
                    alt='noPhoto'
                    className="block mt-0 mx-auto mb-5 w-12rem shadow-2" 
                />}
                <div className="field flex_box">
                    <div className="nameInput">    
                        <label htmlFor="firstName" className="titles">First Name</label>
                        <InputText id="firstName" disabled={props.noEditMode} value={student.firstName} onChange={(e) => onNameChange(e, 'firstName')} required className={classNames({ 'p-invalid': !props.noEditMode && !student.firstName })} />
                        {!props.noEditMode && !student.firstName && <small className="p-error">Name is required.</small>}
                    </div>
                    <div className="nameInput">
                        <label htmlFor="middleName" className="titles">Middle Name</label>
                        <InputText id="middleName" disabled={props.noEditMode} value={student.middleName} onChange={(e) => onNameChange(e, 'middleName')} required className={classNames({ 'p-invalid': !props.noEditMode && !student.middleName })} />
                        {!props.noEditMode && !student.middleName && <small className="p-error">Name is required.</small>}
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="lastName" className="titles">Last Name</label>
                    <InputText id="lastName" disabled={props.noEditMode} value={student.lastName} onChange={(e) => onNameChange(e, 'lastName')} required className={classNames({ 'p-invalid': !props.noEditMode && !student.lastName })} />
                    {!props.noEditMode && !student.lastName && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col-6" >
                        <label htmlFor="date" className="titles">Date Of Birth</label>
                        <Calendar 
                            id="date" 
                            disabled={props.noEditMode}
                            value={student.dateOfBirth ? new Date(student.dateOfBirth.toString()) : undefined} 
                            dateFormat="dd.mm.yy" 
                            monthNavigator yearNavigator yearRange="1980:2025"
                            onChange={(e) => onDateChange(e)} />
                    </div> 
                    <div className="field col">
                        <label className="mb-3 titles">Gender</label>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender1" name="gender" value="FEMALE" onChange={onGenderSet} checked={student.gender === 'FEMALE'}  />
                            <label htmlFor="gender1">Female</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender2" name="gender" value="MALE" onChange={onGenderSet} checked={student.gender === 'MALE'} />
                            <label htmlFor="gender2">Male</label>
                        </div>                        
                    </div>
                    <div className="field col">
                    <label className="mb-3 titles">Insurance</label>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance1" name="insurance" value="1" onChange={onInsuranceChange} checked={student.insurance === true} />
                            <label htmlFor="insurance1">Yes</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance2" name="insurance" value="0" onChange={onInsuranceChange} checked={student.insurance === false} />
                            <label htmlFor="insurance2">No</label>
                        </div>                        
                    </div>
                </div>                
                                       
                
                <div className="formgrid grid">  
                    <div className="field col">
                        <label htmlFor="school" className="titles">School</label>
                        <InputNumber disabled={props.noEditMode} id="school" value={getNumber(student.school!)} onChange={(e) => onSchoolChange(e)} required className={classNames({ 'p-invalid': !props.noEditMode && !student.school })} />
                        {!props.noEditMode && !student.lastName && <small className="p-error">Number is required.</small>}
                    </div>                   
                    
                    <div className="field col">
                        <label htmlFor="shift" className="titles">Shift</label>
                        <Dropdown 
                            id="shift" 
                            disabled={props.noEditMode}
                            value={student.shift}                                                                     
                            options={ShiftOptions}  
                            onChange={e => onShiftChange(e)}
                            placeholder='Select a shift' />
                    </div> 
                </div>
                {groupsList}
                <div>
                    <span>Add to the group </span>
                    <Button 
                        icon="pi pi-plus" 
                        className="p-button p-button-success mr-2" 
                        onClick={() => setAddToGroup(true)}
                    />
                </div>   
                <AddToGroupDialog
                    isVisible = {addToGroup}
                    student = {student}
                    hideDialog = {addToGroupHandler}                    
                />                
                
            </Dialog>
    );
}

export default StudentDetails;