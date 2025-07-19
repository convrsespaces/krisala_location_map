import { ThunkAction } from "@reduxjs/toolkit";
import { Action } from "redux";
import { RootState } from "./index";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;