import { createSlice } from "@reduxjs/toolkit";



export const clinicSlice = createSlice({
    name : "clinic",
    initialState : {
        clinicDetails : {},
        userPermissions : [],
    },
    reducers: {
        clinicSuccess: (state, action) => {
            state.clinicDetails = action.payload;
        },
        savePermissions: (state, action) => {
            state.userPermissions = action.payload;
        },
        clinicClose: (state, action) => {
            state.clinicDetails = {};
            state.userPermissions = [];
        },
        // removePermissions : (state, action) => {
        //     state.userPermissions = null;
        // }
    }
})


export const {clinicSuccess, clinicClose, savePermissions} = clinicSlice.actions;

export default clinicSlice.reducer;
