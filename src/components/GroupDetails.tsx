import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Group } from '../App' 

type GroupDetailsProps = { 
    isVisible: boolean;
    noEditMode: boolean;
    hideDialog: () => void;
    hideAndSaveDialog: (groupInfo: Group) => void;
    allowEdit: () => void;
    groupDetailedData: Group;
    numberOfMembers: number
}

const GroupDetails: React.FC<GroupDetailsProps> = props => {

    const [group, setGroup] = useState<Group>(props.groupDetailedData);
    
    
    useEffect(() => {
       setGroup(props.groupDetailedData);
    }, [props.groupDetailedData]);


    const groupDialogFooter = (
        <React.Fragment>            
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
            {props.noEditMode && <Button label="Edit" icon="pi pi-check" onClick={props.allowEdit} />}
            {!props.noEditMode && <Button label="Save" icon="pi pi-check" onClick={() => props.hideAndSaveDialog(group)} />} 
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={props.isVisible} 
            breakpoints={{'960px': '75vw', '640px': '100vw'}} 
            style={{width: '40vw'}} 
            header="Group Details" 
            modal className="p-fluid" 
            footer={groupDialogFooter} 
            onHide={props.hideDialog}>
                <div className="field flex_box">
                    <div className="nameInput">    
                        <label htmlFor="firstName" className="titles">Group Name</label>
                        <InputText id="firstName" disabled={props.noEditMode} value={group.groupDescription} onChange={(e) => console.log(e, 'event')} required className={classNames({ 'p-invalid': !props.noEditMode && !group.groupDescription })} />
                        {!props.noEditMode && !group.groupDescription && <small className="p-error">Name is required.</small>}
                    </div>
                    <div>
                        Current number of students:
                        <span> {props.numberOfMembers || 0} </span>
                    </div>
                </div>
                

        </Dialog>
    )    
}

export default GroupDetails