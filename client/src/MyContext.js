import React, { createContext, useContext, useState } from "react";

// Create a Context
const MyContext = createContext();

// Create a Provider Component
const MyProvider = ({ children }) => {
    const [state, setState] = useState({
        contextstore: "", // initial value
    });

    // Function to update the contextstore value
    const setStore = (newStoreValue) => {
        setState((prevState) => ({
            ...prevState,
            contextstore: newStoreValue, // update only the contextstore property
        }));
    };

    console.log(state.contextstore, "stores got using context");

    return (
        <MyContext.Provider
            value={{
                ...state,
                setStore,
            }}
        >
            {children}
        </MyContext.Provider>
    );
};

// Custom hook to use the context
const useMyContext = () => {
    return useContext(MyContext);
};

export { MyProvider, useMyContext };
