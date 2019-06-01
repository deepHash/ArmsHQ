import React from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const Pages = [
    {
        text:'All mail',
        MeterialUi: <InboxIcon />
    },
    {
        text:'Trash',
        MeterialUi: <MailIcon />
    },
    {
        text:'Spam',
        MeterialUi: <InboxIcon />
    },
    {
        text:'Manage Force',
        MeterialUi: <MailIcon />
    },
]


export default Pages;
