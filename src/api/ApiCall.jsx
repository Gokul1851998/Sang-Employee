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
      console.log(payload);
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

  export const postLeaveApplication = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostLeaveApplication`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostLeaveApplication',error);
    }
  };

  
  export const getMenuWeb = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetMenuWeb`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetMenuWeb',error);
    }
  };

  export const getLeaveAuthorizationSummary= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetLeaveAuthorizationSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetLeaveAuthorizationSummary',error);
    }
  };

  export const leaveAuthorization = async (payload) => {
    try {
      // Create a new URLSearchParams object
      const params = new URLSearchParams();
  
      // Append each key-value pair from the payload to the URLSearchParams
      Object.entries(payload).forEach(([key, value]) => {
        params.append(key, value);
      });
  
      // Build the complete URL with the query string
      const url = `${baseUrl}LeaveAuthorization?${params.toString()}`;
  
      // Make the POST request with the complete URL
      const response = await axios.post(url);
  
      return response?.data;
    } catch (error) {
      console.log('LeaveAuthorization', error);
    }
  };

  export const getComplaintType= async () => {
    try {
      const response = await axios.get(`${baseUrl}GetComplaintType`);
      return response?.data;
    } catch (error) {
      console.log('GetComplaintType',error);
    }
  };

  export const postComplaints = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostComplaints`,payload);
      return response?.data;
    } catch (error) {
      console.log('PostComplaints',error);
    }
  };

  export const getComplaints = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetComplaints`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetComplaints',error);
    }
  };

  export const complaintSummary = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}ComplaintSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('ComplaintSummary',error);
    }
  };
  


 