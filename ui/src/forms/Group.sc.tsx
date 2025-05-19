import {FormSchema} from "../@types/index";
import {DaysInWeek, status} from "../Constance.ts";
import {DatePicker} from "antd";
export const GroupForm: FormSchema[] = [

  {
    name: "Name",
    type: "text",
    inputProps: {placeholder: "Group Name"}
  },
  {
    name: "status",
    type:"select",
    selectProps: {
      options: status,
      placeholder: "Group Status"
    }
  },
  {
    name: 'group_teacher',
    type: "autoComplete",
    inputProps: {placeholder:"Teacher"},
    autoCompleteProps: {
      
    },
  },
  {
    name: "days",
    type:"select",
    selectProps: {
      placeholder: "Days",
      mode: "multiple",
      options:DaysInWeek,
    }
  },
  {
    type: "field",
    name: "hours",
    fieldProps: {
      children : (
         <>
           <DatePicker picker="time" placeholder="In Hour"></DatePicker>
           <DatePicker picker="time" placeholder="Max Houre"></DatePicker>
           <DatePicker picker="time" placeholder="Out Houre"></DatePicker>
         </>
      ),
    }
  },
  {type: "button", name: "submit"}
]