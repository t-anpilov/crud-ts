import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getProducts } from './ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeParams } from 'primereact/radiobutton';
import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar, CalendarChangeParams } from 'primereact/calendar'
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface Product {
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

type Group = {id: string | number, groupDescription: string}
type Shifts = "FIRST" | "SECOND" | ""
enum Groups {"Старша хлопці", "Молодша дівчата"}

function App() {
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

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);    
    const [noEditMode, setEditMode] = useState(true);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable>(null);

    useEffect(() => {
        getProducts().then(data => setProducts(data));
    }, []);
    
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setEditMode(true)
    }

    const allowEdit = () => {
        setEditMode(false)
    }   

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
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

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    }   

    const editProduct = (product: Product) => {
        setProduct({...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student Removed', life: 3000 });
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
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

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

    const GroupsOptions = Object.keys(Groups).filter(k => typeof Groups[k as any] === "number")

    const showGroup = (data: Group[]) => {
        let result: string[] = []
        data.forEach((group) => result.push(group.groupDescription))        
        return result.join(', ')
    }

    const onGroupsChange = (e: DropdownChangeParams) => {
        const val = e.target && e.target.value;
        let _product = {...product};        
        if (_product.groups) {
            _product.groups.push({id: 1000, groupDescription: val});
            setProduct(_product); 
        }  
    }

    const onInsuranceChange = (e: RadioButtonChangeParams) => {
        let _product = {...product};
        _product['insurance'] = e.value;
        setProduct(_product);
    }    

    const nameBodyTemplate = (rowData: Product) => {
        if(rowData.firstName && rowData.lastName && rowData.middleName) {
            return <span> {`${rowData.lastName} ${rowData.firstName} ${rowData.middleName}`} </span>
        }  
    }

    const addZero = (num: number) => {
        if (num < 10) {
            return '0' + num 
        }
         return num        
    }

    const dateBodyTemplate = (rowData: Product) => {
        if (rowData.dateOfBirth && !Array.isArray(rowData.dateOfBirth)) {            
            let date: Date = new Date(rowData.dateOfBirth)
            let dateArr = [addZero(date.getDate()), addZero(date.getMonth()+1), date.getFullYear()]
            return <span> {`${dateArr[0]}.${dateArr[1]}.${dateArr[2]}`} </span>
        } 
    }

    const genderBodyTemplate = (rowData: Product) => {
        if (rowData.gender) {
            let text = rowData.gender
            return <span> {text[0] + text.slice(1).toLowerCase()} </span>
        } 
    }

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
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
                <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} tooltip="Delete" tooltipOptions={{position: 'bottom'}} />
                
            </div>
        </div>
    );
    
    const productDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {noEditMode && <Button label="Edit" icon="pi pi-check" onClick={allowEdit} />}
            {!noEditMode && <Button label="Save" icon="pi pi-check" onClick={saveProduct} />}
        </React.Fragment>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
            <Toast ref={toast} />

            <div className="text-3xl text-800 font-bold mb-4">STUDENTS</div>

            
            <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll"
                onRowDoubleClick={(e) => editProduct(e.data)}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                
                <Column field="fullname" sortField="lastName" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>                
                <Column field="dateOfBirth" header="Date Of Birth" body={dateBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column> 
                <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                                
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

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

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to remove?<b>{product.firstName + product.lastName}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to remove the selected students?</span>}
                </div>
            </Dialog>   
        </div>
    );
}

export default App;