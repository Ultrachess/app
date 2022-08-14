import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        chainId: 0,
        accounts: [],
        error: "",
        isActivating: false,
        isActive: false,
        provider: null,
    },
    reducers: {
        setChainId: (state, action) => {
            state.chainId = action.payload
        },
        setAccounts: (state, action) => {
            state.accounts = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setIsActivating: (state, action) => {
            state.isActivating = action.payload
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload
        },
        setProvider: (state, action) => {
            state.provider = action.payload
        },
    }
})

export const { setChainId, setAccounts, setError, setIsActivating, setIsActive, setProvider } = authSlice.actions

export default authSlice.reducer