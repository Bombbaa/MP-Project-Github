import React, { useCallback, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import styled from "@emotion/styled";
import { Switch } from "@mui/material";
import { Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

interface Employee {
  id: number;
  asso_No: number;
  nameThai: string;
  attendance: Attendance[];
}

interface Attendance {
  id: number;
  employee_Id: number;
  shift_Id: number;
  status_Id: number;
  created_Date: Date;
  updated_Date: Date;
}

interface EmployeeCardProps {
  employee: Employee;
  control: any;
  currentDates: Dayjs;
}

const EmployeeCard = ({
  employee,
  control,
  currentDates,
}: EmployeeCardProps) => {
  const [isSwitchOn, SetSwtichOn] = useState(false);
  const [descriptionOn, SetDescriptionOn] = useState(false);
  const [radioValue, setRadioValue] = useState<number | null>(null); // State to store the selected radio button value
  const [lastUpdatedShiftId, setLastUpdatedShiftId] = useState<number | null>(
    null
  );

  return (
    <li className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 p-5 rounded-lg">
      <div className="flex items-center">
        <Controller
          name={`[${employee.id}.id]`}
          control={control}
          defaultValue={employee.id}
          render={({ field }) => (
            <input
              type="hidden"
              name={field.name}
              value={field.value}
              ref={field.ref}
              style={{ display: "none" }} // Hide the hidden field using CSS
            />
          )}
        />
        <TextField
          label="ชื่อ-นามสกุล"
          value={employee.nameThai} // Display the employee's nameThai
          InputProps={{
            readOnly: true,
          }}
          className="w-full"
        />
      </div>
      <div className="flex items-center">
        <TextField
          label="รหัสพนักงาน"
          value={employee.asso_No} // Display the employee's asso_No
          InputProps={{
            readOnly: true,
          }}
          className="w-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center font-bold">สถานะการมาทำงาน</h3>
        <fieldset>
          <legend className="sr-only">สถานะการมาทำงาน</legend>
          <div>
            <label>
              <Controller
                name={`${employee.id}.status_Id`}
                control={control}
                defaultValue={2}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="success"
                        checked={field.value === 2}
                        onChange={(event) => {
                          field.onChange(2);
                          SetSwtichOn(false);
                        }}
                      />
                    }
                    label="มาทำงาน"
                  />
                )}
              />
            </label>

            <label>
              <Controller
                name={`${employee.id}.status_Id`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="error"
                        checked={field.value === radioValue}
                        onChange={(event) => {
                          field.onChange(radioValue);
                          SetSwtichOn(true);
                        }}
                      />
                    }
                    label="ลางาน"
                  />
                )}
              />
            </label>
          </div>
        </fieldset>
      </div>
      <div className="flex justify-center items-center">
        <label>
          <Controller
            name={`${employee.id}.shift_Id`}
            control={control}
            defaultValue={2} // Set the default value to 2
            render={({ field }) => (
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={field.value === 3} // Check if it's 3 (You want it to be 3)
                    onChange={(event) => {
                      const newShiftId = field.value === 3 ? 2 : 3;
                      field.onChange(newShiftId);
                      setLastUpdatedShiftId(newShiftId);
                    }}
                  />
                }
                label="สถานะการมาทำงาน"
              />
            )}
          />
        </label>
      </div>
      {isSwitchOn === true && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 px-5 py-7 bg-slate-100 border rounded-md flex flex-col items-center gap-5 slide-in">
          <h3 className="text-center text-2xl font-bold my-4">
            เหตุผลประกอบการลา
          </h3>
          <RadioGroup
            name={`${employee.id}.status_Id`}
            value={radioValue}
            onChange={(event) => {
              const newValue = parseInt(event.target.value, 10);
              setRadioValue(newValue);
            }}
          >
            <div className="grid grid-cols-3 gap-x-10 max-sm:grid-cols-1 place-items-start">
              <Controller
                name={`${employee.id}.status_Id`}
                control={control}
                render={({ field }) => (
                  <label>
                    <FormControlLabel
                      control={
                        <Radio
                          color="warning"
                          checked={field.value === 3}
                          value={3}
                          onChange={(event) => {
                            field.onChange(3);
                            SetDescriptionOn(false);
                          }}
                          required
                        />
                      }
                      label="ลาป่วย"
                    />
                  </label>
                )}
              />
              <Controller
                name={`${employee.id}.status_Id`}
                control={control}
                render={({ field }) => (
                  <label>
                    <FormControlLabel
                      control={
                        <Radio
                          color="warning"
                          checked={field.value === 4}
                          value={4}
                          onChange={(event) => {
                            field.onChange(4);
                            SetDescriptionOn(false);
                          }}
                          required
                        />
                      }
                      label="ลาพักร้อน"
                    />
                  </label>
                )}
              />
              <Controller
                name={`${employee.id}.status_Id`}
                control={control}
                render={({ field }) => (
                  <label>
                    <FormControlLabel
                      control={
                        <Radio
                          color="warning"
                          checked={field.value === 5}
                          value={5}
                          onChange={(event) => {
                            field.onChange(5);
                            SetDescriptionOn(true);
                          }}
                          required
                        />
                      }
                      label="อื่นๆ"
                    />
                  </label>
                )}
              />
            </div>
          </RadioGroup>
          {descriptionOn === true && (
            <Controller
              name={`${employee.id}.description`} // Unique name for the TextField
              control={control}
              // defaultValue={null}
              shouldUnregister={false} // Add this prop to prevent unregistration
              render={({ field }) => (
                <TextField
                  label="สาเหตุ..."
                  multiline
                  rows={4}
                  className="w-3/5 max-lg:w-full bg-white"
                  required
                  {...field}
                />
              )}
            />
          )}
        </div>
      )}
      <Controller
        name={`${employee.id}.updated_Date`} // Unique name for the TextField
        control={control}
        defaultValue={dayjs(currentDates).format("YYYY-MM-DD HH:mm:ss")}
        render={({ field }) => (
          <input
            type="hidden"
            name={field.name}
            value={field.value}
            ref={field.ref}
            style={{ display: "none" }} // Hide the hidden field using CSS
          />
        )}
      />
    </li>
  );
};

const MemoizedEmployeeCard = React.memo(EmployeeCard);

export default MemoizedEmployeeCard;

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#9eb4c2" //สี icon ปุ่มหลังกด
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#564760", // สี switch หลังกด
      },
    },
    "&.Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#c8d7d9", // สี Thumb หลังกด
      border: "0px",
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#ff9a00", // สี Thumb ก่อนกด
    width: 32,
    height: 32,
    border: "1px solid #E67451",
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#ecefef"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },

  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#21a0c1", //สี switch ก่อนกด
    borderRadius: 20 / 2,
  },
}));
