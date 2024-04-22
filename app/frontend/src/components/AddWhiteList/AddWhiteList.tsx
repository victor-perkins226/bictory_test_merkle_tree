import { Button, Input } from "@mui/material";
import React, { FC } from "react";
import {  useState } from "react";

interface AddWhiteListProps {
    onAddWhiteList: Function
}

export const AddWhiteList: FC<AddWhiteListProps> = (props) => {
    const [newAddress, setNewAddress] = useState('');

    return (
        <div>
            <Input type="text" value={newAddress} onChange={e => setNewAddress(e.target.value)}></Input>
            <Button onClick={() => props.onAddWhiteList(newAddress)} variant= "text" >Add</Button>
        </div>
    );
};
