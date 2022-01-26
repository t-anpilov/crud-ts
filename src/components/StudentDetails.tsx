import React, { useState, ChangeEvent, useEffect } from 'react';
import { Calendar, CalendarChangeParams } from 'primereact/calendar'
import { RadioButton, RadioButtonChangeParams  } from 'primereact/radiobutton'
import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Student, Shifts } from '../App'  
import { emptyStudent } from './StudentsList'

type StudentDetailsProps = { 
    isVisible: boolean;
    noEditMode: boolean;
    hideDialog: () => void;
    allowEdit: () => void;
    studentDetailedData: Student
 }

const StudentDetails: React.FC<StudentDetailsProps> = props => {
      
    
    const [student, setStudent] = useState<Student>(props.studentDetailedData || emptyStudent);    
    const [submitted, setSubmitted] = useState(false); 
    
    useEffect(() => {
       setStudent(props.studentDetailedData);
    }, [props.studentDetailedData])
    
        
    /*const hideDialog = () => {        
        setSubmitted(false);                
        setNoEditMode(true)
    }

    const allowEdit = () => {
        setNoEditMode(false)
    }*/
    

    /*const saveStudent = () => {
        setSubmitted(true);
        setEditMode(true);

        if (student.firstName?.trim() &&student.lastName?.trim()) {
            let _students = [...students];
            let _student = {...student};
            if (student.id) {
                const index = findIndexById(student.id);

                _students[index] = _student;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student\'s Data Updated', life: 3000 });
            }
            else {
                _student.id = createId();
                _student.photoId = 'avatar2.png';
                _students.push(_student);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student\'s Profile Updated', life: 3000 });
            }

            setStudents(_students); // shouldn't work
            setStudentDialog(false);
            setStudent(emptyStudent);
        }
    }
   

    const findIndexById = (id: string | number) => {
        let index = -1;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }}*/

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // need to change to save Element function onclick for 2nd buttom

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
        for (let i=0; i<str.length; i++) {
            if(!isNaN(Number(str[i]))) {
               num = i  
               break              
            }
        }
        return parseInt( str.slice(num) )   
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

    // need to clarify, better change from checkbox to use buttons or disable editing inside
    const onGroupChange = (e: CheckboxChangeParams) => {
        
        //no need to update inside component:
        /*const val = e.value;
        let _student = {...student};
        
        if (_student.groups) {
            _student.groups =[..._student.groups.filter( group => group.id === val)];
            setStudent(_student); 
        }  */
    }

    const onInsuranceChange = (e: RadioButtonChangeParams) => {
        let _student = {...student};
        _student['insurance'] = e.value;
        setStudent(_student);
    }    


    const studentDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
            {props.noEditMode && <Button label="Edit" icon="pi pi-check" onClick={props.allowEdit} />}
            {!props.noEditMode && <Button label="Save" icon="pi pi-check" onClick={props.hideDialog} />} 
        </React.Fragment>
    );

    const groupsList = (
        <React.Fragment>
            <div >
            { student.groups && student.groups.map( group => {
                return (
                    <div className='col-12'>  
                    <Checkbox 
                        inputId={`group1${group.id}`} 
                        disabled={props.noEditMode}
                        checked={true}
                        value={group.id}
                        onChange={(e) => onGroupChange(e)}
                    /> 
                    <label className="p-checkbox-label" htmlFor={`group1${group.id}`}>{`  ${group.groupDescription}`}</label>                   
                    </div>
                    )
                }
            )}
            </div>
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
            onHide={props.hideDialog}>
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
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <InputText id="firstName" disabled={props.noEditMode} value={student.firstName} onChange={(e) => onNameChange(e, 'firstName')} required className={classNames({ 'p-invalid': submitted && !student.firstName })} />
                    {submitted && !student.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="middleName">Middle Name</label>
                    <InputText id="middleName" disabled={props.noEditMode} value={student.middleName} onChange={(e) => onNameChange(e, 'middleName')} required className={classNames({ 'p-invalid': submitted && !student.middleName })} />
                    {submitted && !student.middleName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <InputText id="lastName" disabled={props.noEditMode} value={student.lastName} onChange={(e) => onNameChange(e, 'lastName')} required className={classNames({ 'p-invalid': submitted && !student.lastName })} />
                    {submitted && !student.lastName && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col-6" >
                        <label htmlFor="date">Date Of Birth</label>
                        <Calendar 
                            id="date" 
                            disabled={props.noEditMode}
                            value={student.dateOfBirth ? new Date(student.dateOfBirth.toString()) : undefined} 
                            dateFormat="dd.mm.yy" 
                            monthNavigator yearNavigator yearRange="1980:2025"
                            onChange={(e) => onDateChange(e)} />
                    </div> 
                    <div className="field col">
                        <label className="mb-3">Gender</label>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender1" name="gender" value="Female" onChange={onGenderSet} checked={student.gender === 'FEMALE'}  />
                            <label htmlFor="gender1">Female</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender2" name="gender" value="Male" onChange={onGenderSet} checked={student.gender === 'MALE'} />
                            <label htmlFor="gender2">Male</label>
                        </div>                        
                    </div>
                    <div className="field col">
                    <label className="mb-3">Insurance</label>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance1" name="insurance" onChange={onInsuranceChange} checked={student.insurance === true} />
                            <label htmlFor="insurance1">Yes</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance2" name="insurance" onChange={onInsuranceChange} checked={student.insurance === false} />
                            <label htmlFor="insurance2">No</label>
                        </div>                        
                    </div>
                </div>                
                                       
                
                <div className="formgrid grid">  
                    <div className="field col">
                        <label htmlFor="school">School</label>
                        <InputNumber disabled={props.noEditMode} id="school" value={getNumber(student.school!)} onChange={(e) => onSchoolChange(e)} required className={classNames({ 'p-invalid': submitted && !student.school })} />
                        {submitted && !student.lastName && <small className="p-error">Number is required.</small>}
                    </div>                   
                    
                    <div className="field col">
                        <label htmlFor="shift">Shift</label>
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
                
            </Dialog>
    );
}

export default StudentDetails;