import { createSlice, PayloadAction } from 'redux-starter-kit';
import { SliceActionCreator } from 'redux-starter-kit/src/createSlice';

export type Name = string;

export const initialState: Name = 'Loading';

export const nameSlice = 'name';

export type GetNamePayload = void;
export type GetNameAction = PayloadAction<GetNamePayload>;
export type GetNameActionCreator = SliceActionCreator<GetNamePayload>;

export type SetNamePayload = Name;
export type SetNameAction = PayloadAction<SetNamePayload>;
export type SetNameActionCreator = SliceActionCreator<SetNamePayload>;

export type NamePayload = SetNamePayload | GetNamePayload;
export type NameAction = PayloadAction<NamePayload>;
export type NameActionCreator = SliceActionCreator<NamePayload>;

export const {
  reducer: name,
  actions: { setName },
} = createSlice<Name, NameAction>({
  slice: nameSlice,
  initialState,
  reducers: {
    setName: (_, { payload }) => payload,
  },
});

export const getName: NameActionCreator = () => ({
  type: nameSlice.concat('/').concat('getName'),
  payload: undefined,
});
