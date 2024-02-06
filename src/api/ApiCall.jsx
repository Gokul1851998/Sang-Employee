import axios from "axios"
import { baseUrl } from "./baseUrl";

export const getLogin = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}UserLogin`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('UserLogin',error);
    }
  };

  export const postDailyTask = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostDailyTask`,payload);
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log('PostDailyTask',error);
    }
  };

  export const getEmployee = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetEmployee`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetEmployee',error);
    }
  };

  export const getDailyTaskReport = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetDailyTaskReport`, {
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetDailyTaskReport',error);
    }
  };

  export const getTaskType = async () => {
    try {
      const response = await axios.get(`${baseUrl}GetTaskType`);
      return response?.data;
    } catch (error) {
      console.log('GetTaskType',error);
    }
  };

  export const getCustomer = async () => {
    try {
      const response = await axios.get(`${baseUrl}GetCustomer`);
      return response?.data;
    } catch (error) {
      console.log('GetCustomer',error);
    }
  };

  export const getLeaveApplicationSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetLeaveApplicationSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetLeaveApplicationSummary',error);
    }
  };

  export const deleteLeaveApplication = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}DeleteLeaveApplication`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteLeaveApplication',error);
    }
  };

  export const getLeaveApplicationDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetLeaveApplicationDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetLeaveApplicationDetails',error);
    }
  };

  export const getLeave_Type = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetLeave_Type`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetLeave_Type',error);
    }
  };




 