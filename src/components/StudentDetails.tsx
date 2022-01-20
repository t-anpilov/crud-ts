import React, { useState, useRef, FormEvent } from 'react';
import { Calendar, CalendarChangeParams } from 'primereact/calendar'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Product } from '../App'  

interface StudentDetailsProps {
    student: Product
}

const StudentDetails: React.FC<StudentDetailsProps> = student => {
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

    const [/*products*/, setStudents] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);   
    const [noEditMode, setEditMode] = useState(true);
    const [product, setProduct] = useState<Product>(emptyProduct);    
    const [submitted, setSubmitted] = useState(false);    
    const toast = useRef<Toast>(null);
    
    
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setEditMode(true)
    }

    const allowEdit = () => {
        setEditMode(false)
    }
    

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
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }*/

    // need to change to save Element function onclick for 2nd buttom
    const productDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {noEditMode && <Button label="Edit" icon="pi pi-check" onClick={allowEdit} />}
            {!noEditMode && <Button label="Save" icon="pi pi-check" onClick={hideDialog} />} 
        </React.Fragment>
    );


    return (
        <Dialog visible={productDialog} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '40vw'}} header="Student Profile" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.photoId && <img 
                    src={`demo/images/product/${product.photoId}`} 
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
                    <InputText id="firstName" disabled={noEditMode} value={product.firstName} onChange={(e) => onNameChange(e, 'firstName')} required className={classNames({ 'p-invalid': submitted && !product.firstName })} />
                    {submitted && !product.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="middleName">Middle Name</label>
                    <InputText id="middleName" disabled={noEditMode} value={product.middleName} onChange={(e) => onNameChange(e, 'middleName')} required className={classNames({ 'p-invalid': submitted && !product.middleName })} />
                    {submitted && !product.middleName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">Middle Name</label>
                    <InputText id="lastName" disabled={noEditMode} value={product.lastName} onChange={(e) => onNameChange(e, 'lastName')} required className={classNames({ 'p-invalid': submitted && !product.lastName })} />
                    {submitted && !product.lastName && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col-6" >
                        <label htmlFor="date">Date Of Birth</label>
                        <Calendar 
                            id="date" 
                            disabled={noEditMode}
                            value={product.dateOfBirth ? new Date(product.dateOfBirth.toString()) : undefined} 
                            dateFormat="dd.mm.yy" 
                            monthNavigator yearNavigator yearRange="1980:2025"
                            onChange={(e) => onDateChange(e)} />
                    </div> 
                    <div className="field col">
                        <label className="mb-3">Gender</label>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={noEditMode} inputId="gender1" name="gender" value="Female" onChange={onGenderSet} checked={product.gender === 'FEMALE'}  />
                            <label htmlFor="gender1">Female</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton disabled={noEditMode} inputId="gender2" name="gender" value="Male" onChange={onGenderSet} checked={product.gender === 'MALE'} />
                            <label htmlFor="gender2">Male</label>
                        </div>                        
                    </div>
                    <div className="field col">
                    <label className="mb-3">Insurance</label>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={noEditMode} inputId="insurance1" name="insurance" onChange={onInsuranceChange} checked={product.insurance === true} />
                            <label htmlFor="insurance1">Yes</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton disabled={noEditMode} inputId="insurance2" name="insurance" onChange={onInsuranceChange} checked={product.insurance === false} />
                            <label htmlFor="insurance2">No</label>
                        </div>                        
                    </div>
                </div>                
                                       
                
                <div className="formgrid grid">  
                    <div className="field col">
                        <label htmlFor="school">School</label>
                        <InputNumber disabled={noEditMode} id="school" value={getNumber(product.school!)} onChange={(e) => onSchoolChange(e)} required className={classNames({ 'p-invalid': submitted && !product.school })} />
                        {submitted && !product.lastName && <small className="p-error">Number is required.</small>}
                    </div>                   
                    
                    <div className="field col">
                        <label htmlFor="shift">Shift</label>
                        <Dropdown 
                            id="shift" 
                            disabled={noEditMode}
                            value={product.shift}                                                                     
                            options={ShiftOptions}  
                            onChange={(e) => onShiftChange(e)}
                            placeholder='Select a shift' />
                    </div> 
                </div>
                <div className="field">
                    <label htmlFor="group">Group</label>
                    <Dropdown 
                        id="group" 
                        disabled={noEditMode}
                        value={product.groups? showGroup(product.groups) : ''}                                                   
                        options={GroupsOptions}  
                        onChange={(e) => onGroupsChange(e)}
                        placeholder='Select a group' />
                </div>
            </Dialog>
    );
}

export default StudentDetails;