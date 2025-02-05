import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { ReactComponent as TomatoIconDuo } from '../../../assets/icons/tomato-duo.svg'
import './PomodoroPicker.scss';

const { ipcRenderer } = window.api;

interface Props {
  pomodoro: number | string;
  textFieldValue: string;
  todoObject: TodoObject | null;
}

const PomodoroPicker: React.FC<Props> = ({
  pomodoro,
  textFieldValue,
  todoObject,
}) => {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = (event.target.value === '0') ? null : event.target.value;
      ipcRenderer.send('updateTodoObject', todoObject?.id, textFieldValue, 'pm', value);
    } catch(error: any) {
      console.error(error);
    }
  };

  return (
      <FormControl id="pomodoroPicker">
        <TextField
          id="pomodoroPicker"
          label={<TomatoIconDuo />}
          type="number"
          onChange={handleChange}
          value={pomodoro}
          data-testid="dialog-picker-pomodoro"
          inputProps={{
            min: 0,
          }}
        />
      </FormControl>
  );
};

export default PomodoroPicker;
