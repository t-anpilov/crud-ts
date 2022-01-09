import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getProducts } from './ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
//import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeParams } from 'primereact/radiobutton';
import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
//import { groupCollapsed } from 'console';

interface Product {
    id?: string | number;
    name?: string;
    firstName: string;
    lastName: string;
    middleName: string;
    photoId?: string;
    gender?: string;
    dateOfBirth?: Date | string;
    insurance?: boolean;
    school?: string;
    shift?: "FIRST" | "SECOND" | "";
    groups?: {id: string | number, groupDescription: string}[]

    description?: string;
    category?: string;
    price?: number;
    quantity?: number;
    rating?: number;
    inventoryStatus?: string;
}

function App() {
    let emptyProduct: Product = {
        id: '',
        name: '',
        firstName: '',
        lastName: '',
        middleName: '',
        photoId: '',
        dateOfBirth: '',
        insurance: false,
        school: '',
        shift: '',
        groups: []


        /*description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'*/
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable>(null);

    useEffect(() => {
        getProducts().then(data => setProducts(data));
    }, []);

    /*const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }*/

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.firstName?.trim() &&product.lastName?.trim()) {
            let _products = [...products];
            let _product = {...product};
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                _product.id = createId();
                _product.photoId = 'avatar2.png';
                _products.push(_product);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
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
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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

    const exportCSV = () => {
        dt.current?.exportCSV({selectionOnly:false});
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

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = (e.target && e.target.value) || '';
        let _product: Product = {...product};
        _product.firstName = val;

        setProduct(_product);
    }

    const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _product: Product = {...product};
        _product.description = val;

        setProduct(_product);
    }

    const onPriceChange = (e: InputNumberChangeParams) => {
        const val = e.value || 0;
        let _product = {...product};
        _product.price = val;

        setProduct(_product);
    }

    const onQuantityChange = (e: InputNumberChangeParams) => {
        const val = e.value || 0;
        let _product = {...product};
        _product.quantity = val;

        setProduct(_product);
    }

    const imageBodyTemplate = (rowData: Product) => {
        if(rowData.photoId && rowData.photoId!==null) {
            return <img src={`demo/images/product/${rowData.photoId}`} alt={rowData.photoId} className="w-7rem shadow-2" />
        } else {
            return <img src='demo/images/product/avatar2.png' alt='default avatar' className="w-7rem shadow-2" />
        }        
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
        if (rowData.dateOfBirth) {            
            let date: Date = new Date(rowData.dateOfBirth)
            let dateArr = [addZero(date.getDate()), addZero(date.getMonth()+1), date.getFullYear()]
            return <span> {`${dateArr[0]}.${dateArr[1]}.${dateArr[2]}`} </span>
        } 
    }

    const shiftBodyTemplate = (rowData: Product) => {
        if(rowData.shift && rowData.shift === "FIRST") {
            return <span>1</span>
        } else if (rowData.shift && rowData.shift === "SECOND") {
            return <span>2</span>
        }        
    }
    
    
    const groupBodyTemplate = (rowData: Product) => {        
        if(rowData.groups) {            
            return <div> {
                rowData.groups.map((group) =>  `${group.groupDescription} `)
            } </div>                        
        }  
    }

    const genderBodyTemplate = (rowData: Product) => {
        if (rowData.gender) {
            let text = rowData.gender
            return <span> {text[0] + text.slice(1).toLowerCase()} </span>
        } 
    }

    /*const priceBodyTemplate = (rowData: Product) => {
        return (rowData.price !== undefined) ? formatCurrency(rowData.price): '';
    }

    const ratingBodyTemplate = (rowData: Product) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const statusBodyTemplate = (rowData: Product) => {
        return <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }*/

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
                <Button icon="pi pi-upload" className="p-button-help p-button-rounded" onClick={exportCSV} tooltip="Export" tooltipOptions={{position: 'bottom'}} />
            </div>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
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

            <div className="text-3xl text-800 font-bold mb-4">PrimeReact CRUD</div>

            <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                
                <Column field="image" header="Photo" body={imageBodyTemplate}></Column>
                <Column field="fullname" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>                
                <Column field="dateOfBirth" header="Date Of Birth" body={dateBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column> 
                <Column field="shift" header="Shift" body={shiftBodyTemplate} sortable style={{ minWidth: '6rem' }}></Column> 
                <Column field="groups" header="Groups" body={groupBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>              
                <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                
                
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={productDialog} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '40vw'}} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.photoId && <img 
                    src={`demo/images/product/${product.photoId}`} 
                    alt={product.photoId} 
                    className="block mt-0 mx-auto mb-5 w-20rem shadow-2" 
                />}
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={product.firstName} onChange={(e) => onNameChange(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !product.firstName })} />
                    {submitted && !product.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onDescriptionChange(e)} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3">Gender</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onGenderSet} checked={product.gender === 'FEMALE'} />
                            <label htmlFor="gender1">Female</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onGenderSet} checked={product.gender === 'MALE'} />
                            <label htmlFor="gender2">Male</label>
                        </div>
                        
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onPriceChange(e)} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onQuantityChange(e)} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete <b>{product.firstName + product.lastName}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default App;