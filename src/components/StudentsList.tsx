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
import { Product } from '../App'  
import StudentDetails from './StudentDetails'
import { getStudentDetails } from '../GetStudents'

interface StudentsListProps {
    students: Product []
}

const StudentsList: React.FC<StudentsListProps> = ({students}) => {
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

    const [studentsList, setStudentsList] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);  
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [currentStudent, setCurrentStudent] = useState<Product>()
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [noEdit, setNoEdit] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable>(null);
    
    
    const openNew = () => {
        setCurrentStudent(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    } 
    const allowEditHandler = () => {        
        setNoEdit(false)
    }

    const hideDialogHandler = () => {
        setProductDialog(false)
        setSubmitted(false);                
        setNoEdit(true)
    }    

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }   
    
    const editProduct = async (product: Product) => {  
        let _currentStudent = await getStudentDetails(product.id)
        setCurrentStudent({..._currentStudent});        
        setProductDialog(true);
    }
    

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }
  // q if we need
    const deleteProduct = () => {
        let _products : Product []
        if (Array.isArray(students)) {
            _products = students.filter((val: { id: string | number; }) => val.id !== product.id);
            setStudentsList(_products); 
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Student Removed', life: 3000 });
        } 
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products : Product []
        if (Array.isArray(students)) {
            _products = students.filter((val: Product) => !selectedProducts.includes(val));
            setStudentsList(_products);
            setDeleteProductsDialog(false);
            setSelectedProducts([]);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        }
        console.log (studentsList) // checking rempve function
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

    // there is action to open details
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

    
    //console.log (students) 
    console.log ('state variable', currentStudent) 

    return (
        <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
            <Toast ref={toast} />

            <div className="text-3xl text-800 font-bold mb-4">STUDENTS</div>

            
            <DataTable ref={dt} value={ students} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll"
                onRowDoubleClick={(e) => editProduct(e.data)}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                
                <Column field="fullname" sortField="lastName" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>                
                <Column field="dateOfBirth" header="Date Of Birth" body={dateBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column> 
                <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                                
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem', textAlign: 'right' }} bodyClassName='right_control'></Column>
            </DataTable>

            {currentStudent && <StudentDetails 
                isVisible={productDialog}
                studentDetailedData={currentStudent}
                noEditMode={noEdit} 
                hideDialog={hideDialogHandler} 
                allowEdit={allowEditHandler}/>
            }            
            
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

export default StudentsList;