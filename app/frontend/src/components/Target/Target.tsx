import { Button, Input } from "@mui/material";

import React, { FC } from "react";
interface TargetProps {
    onTarget: Function
}

export const Target: FC<TargetProps> = (props) => {
    return (
        <div>
            <Button onClick={() => props.onTarget()} variant= "text" >Target</Button>
        </div>
    );
};
