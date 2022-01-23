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
import { Product, Shifts, Group } from '../App'  

type StudentDetailsProps = { 
    isVisible: boolean;
    noEditMode: boolean;
    hideDialog: () => void;
    allowEdit: () => void;
    studentDetailedData: Product
 }

const StudentDetails: React.FC<StudentDetailsProps> = props => {
    let emptyProduct: Product = {
        id: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: new Date(),
        gender: '',
        photoId: null,
        insurance: false,
        school: '',
        shift: '',
        groups: []

    };   
    
    const [product, setProduct] = useState<Product>(props.studentDetailedData || emptyProduct);    
    const [submitted, setSubmitted] = useState(false); 
    
    useEffect(() => {
       setProduct(props.studentDetailedData);
    }, [props.studentDetailedData])
    
        
    /*const hideDialog = () => {        
        setSubmitted(false);                
        setNoEditMode(true)
    }

    const allowEdit = () => {
        setNoEditMode(false)
    }*/
    

    /*const saveProduct = () => {
        setSubmitted(true);
        setEditMode(true);

        if (product.firstName?.trim() &&product.lastName?.trim()) {
            let _products = [...products];
            let _product = {...product};
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student\'s Data Updated', life: 3000 });
            }
            else {
                _product.id = createId();
                _product.photoId = 'avatar2.png';
                _products.push(_product);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student\'s Profile Updated', life: 3000 });
            }

            setStudents(_products); // shouldn't work
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    }
   

    const findIndexById = (id: string | number) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }}*/

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
        let _product = {...product};
        _product['gender'] = e.value;
        setProduct(_product);
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>, prop: 'firstName'|'lastName'|'middleName') => {
        const val = (e.target && e.target.value) || '';
        let _product: Product = {...product};
        if (prop === 'firstName') {
            _product.firstName = val;
        } else if (prop === 'lastName') {
            _product.lastName = val;
        } else if (prop === 'middleName') {
            _product.middleName = val;
        }    
        setProduct(_product);
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
        let _product = {...product};
        _product.school =  '#' + val;
        setProduct(_product);
    }

    const onDateChange = (e: CalendarChangeParams) => {
        if (e.target.value!==null)   {
            const val = (e.target && e.target.value);
            let _product = {...product};
            if (val) _product.dateOfBirth = val;
            setProduct(_product);
        }  
    }

    const ShiftOptions: Shifts[] = ["FIRST", "SECOND"]

    const onShiftChange = (e: DropdownChangeParams) => {
        const val = e.target && e.target.value;
        let _product = {...product};        
        _product.shift = val;   
        setProduct(_product);        
    }

    // need to clarify
    const onGroupChange = (e: CheckboxChangeParams) => {
        const val = e.value;
        let _product = {...product};        
        if (!e.checked && _product.groups) {
            _product.groups.filter( group => group.id === val);
            setProduct(_product); 
        }  
    }

    const onInsuranceChange = (e: RadioButtonChangeParams) => {
        let _product = {...product};
        _product['insurance'] = e.value;
        setProduct(_product);
    }    


    const productDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
            {props.noEditMode && <Button label="Edit" icon="pi pi-check" onClick={props.allowEdit} />}
            {!props.noEditMode && <Button label="Save" icon="pi pi-check" onClick={props.hideDialog} />} 
        </React.Fragment>
    );

    const groupsList = (
        <React.Fragment>
            <div >
            { product.groups && product.groups.map( group => {
                return (
                    <div className=''>  
                    <Checkbox 
                        id={`group1${group.id}`} 
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
            footer={productDialogFooter} 
            onHide={props.hideDialog}>
                {product.photoId && <img 
                    src={`demo/images/prvisibleDialog,duct/${product.photoId}`} 
                    alt={product.photoId} 
                    className="block mt-0 mx-auto mb-5 w-12rem shadow-2" 
                />}
                {product.photoId===null && <img 
                    src='demo/images/product/avatar2.png' 
                    alt='noPhoto'
                    className="block mt-0 mx-auto mb-5 w-12rem shadow-2" 
                />}
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <InputText id="firstName" disabled={props.noEditMode} value={product.firstName} onChange={(e) => onNameChange(e, 'firstName')} required className={classNames({ 'p-invalid': submitted && !product.firstName })} />
                    {submitted && !product.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="middleName">Middle Name</label>
                    <InputText id="middleName" disabled={props.noEditMode} value={product.middleName} onChange={(e) => onNameChange(e, 'middleName')} required className={classNames({ 'p-invalid': submitted && !product.middleName })} />
                    {submitted && !product.middleName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <InputText id="lastName" disabled={props.noEditMode} value={product.lastName} onChange={(e) => onNameChange(e, 'lastName')} required className={classNames({ 'p-invalid': submitted && !product.lastName })} />
                    {submitted && !product.lastName && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col-6" >
                        <label htmlFor="date">Date Of Birth</label>
                        <Calendar 
                            id="date" 
                            disabled={props.noEditMode}
                            value={product.dateOfBirth ? new Date(product.dateOfBirth.toString()) : undefined} 
                            dateFormat="dd.mm.yy" 
                            monthNavigator yearNavigator yearRange="1980:2025"
                            onChange={(e) => onDateChange(e)} />
                    </div> 
                    <div className="field col">
                        <label className="mb-3">Gender</label>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender1" name="gender" value="Female" onChange={onGenderSet} checked={product.gender === 'FEMALE'}  />
                            <label htmlFor="gender1">Female</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={props.noEditMode} inputId="gender2" name="gender" value="Male" onChange={onGenderSet} checked={product.gender === 'MALE'} />
                            <label htmlFor="gender2">Male</label>
                        </div>                        
                    </div>
                    <div className="field col">
                    <label className="mb-3">Insurance</label>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance1" name="insurance" onChange={onInsuranceChange} checked={product.insurance === true} />
                            <label htmlFor="insurance1">Yes</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={props.noEditMode} inputId="insurance2" name="insurance" onChange={onInsuranceChange} checked={product.insurance === false} />
                            <label htmlFor="insurance2">No</label>
                        </div>                        
                    </div>
                </div>                
                                       
                
                <div className="formgrid grid">  
                    <div className="field col">
                        <label htmlFor="school">School</label>
                        <InputNumber disabled={props.noEditMode} id="school" value={getNumber(product.school!)} onChange={(e) => onSchoolChange(e)} required className={classNames({ 'p-invalid': submitted && !product.school })} />
                        {submitted && !product.lastName && <small className="p-error">Number is required.</small>}
                    </div>                   
                    
                    <div className="field col">
                        <label htmlFor="shift">Shift</label>
                        <Dropdown 
                            id="shift" 
                            disabled={props.noEditMode}
                            value={product.shift}                                                                     
                            options={ShiftOptions}  
                            onChange={(e) => onShiftChange(e)}
                            placeholder='Select a shift' />
                    </div> 
                </div>
                {groupsList}                
                
            </Dialog>
    );
}

export default StudentDetails;