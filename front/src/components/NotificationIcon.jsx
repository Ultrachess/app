import React from "react";
import { styled } from "@stitches/react";
import { BellIcon } from "@radix-ui/react-icons";
import NotificationDropdown from "./NotificationDropdown";

const StyledBellIcon = styled(BellIcon, {
    color: "white",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
    backgroundColor: "black",
    "&:hover": {
        backgroundColor: "white",
        color: "black",
    },
    variants: {

    }

});

export const NotificationIcon = () => {

    return (
        <NotificationDropdown
            trigger={<StyledBellIcon />}
        />
    );
}
