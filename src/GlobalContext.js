import React, { useState } from "react";
export const Context = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [pipeline, setPipeline] = useState(
        {
            step: 0,
            name: "",
            error: ""
        });

    return (
        <Context.Provider value={{ pipeline, setPipeline }}>
            {children}
        </Context.Provider>
    );
};
