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
import { Group } from '../App'

interface GroupsListProps {
    groups: Group []
}

const GroupsList: React.FC<GroupsListProps> = ({groups}) => {

    const emptyGroup = {id: '', groupDescription: ''}

    
    const [groupDialog, setGroupDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>();
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);
    const [deleteGroupsDialog, setDeleteGroupsDialog] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Group>(); 
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable>(null);
    
    const createGroup = () => {
        setCurrentGroup(emptyGroup);
        setSubmitted(false);
        setGroupDialog(true);
    } 

    const confirmDeleteSelected = () => {
        setDeleteGroupsDialog(true);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
            <span className="p-input-icon-left w-full md:w-auto">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: FormEvent<HTMLInputElement>) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." className="w-full lg:w-auto" />
            </span>
            <div className="mt-3 md:mt-0 flex justify-content-end">
                <Button icon="pi pi-plus" className="mr-2 p-button-rounded" onClick={createGroup} tooltip="New" tooltipOptions={{position: 'bottom'}} />
                <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedGroups || !selectedGroups.length} tooltip="Delete" tooltipOptions={{position: 'bottom'}} />
                
            </div>
        </div>
    ); 

    const actionBodyTemplate = (rowData: Group) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => console.log(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => alert(`delete ${rowData}?`)} />
            </React.Fragment>
        );
    }

    return (
        <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
            <Toast ref={toast} />

            <div className="text-3xl text-800 font-bold mb-4">GROUPS</div>
            
            <DataTable ref={dt} value={groups} selection={selectedGroups} onSelectionChange={(e) => setSelectedGroups(e.value)}
                dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} groups"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                
                <Column field="id" header="ID"  sortable style={{ minWidth: '4rem' }}></Column>                
                <Column field="groupDescription" header="Name" sortable style={{ minWidth: '20rem' }}></Column>                 
                                
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem', textAlign: 'right' }} bodyClassName='right_control'></Column>
            </DataTable>

            
        </div>
    )
}

export default GroupsList