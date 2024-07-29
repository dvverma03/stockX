import { createSlice } from "@reduxjs/toolkit"

const gptSlice = createSlice({
    name:"gpt",
    initialState:false,
    reducers:{
        toggleState:(state)=>{
            return !state
        }
    },
});
export const  {toggleState} = gptSlice.actions;
export default gptSlice.reducer;