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

  export const deleteComplaints = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}DeleteComplaints`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteComplaints',error);
    }
  };

  export const postComplaintAuth = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostComplaintAuth`,payload);
      return response?.data;
    } catch (error) {
      console.log('PostComplaintAuth',error);
    } 
  };

  export const getProjectSummary= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}ProjectSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('ProjectSummary',error);
    }
  };

  export const getAssignedProject= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetAssignedProject`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetAssignedProject',error);
    }
  };

  export const getProject= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetProject`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProject',error);
    }
  };

  export const getProjectDetails= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetProjectDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetProjectDetails',error);
    }
  };

  export const postProject = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostProject`,payload);
      return response?.data;
    } catch (error) {
      console.log('PostProject',error);
    } 
  };


  export const postSubTask = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostSubTask`,payload);
      return response?.data;
    } catch (error) {
      console.log('PostSubTask',error);
    } 
  };

  export const deleteProject= async (payload,payload2) => {
    try {
      const response = await axios.post(`${baseUrl}DeleteProject`,payload2,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteProject',error);
    }
  };

  export const getExpenseSummary= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetExpenseSummary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetExpenseSummary',error);
    }
  };

  export const getDeleteExpense= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}DeleteExpense`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeleteExpense',error);
    }
  };

  export const getCategory= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetCategory`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetCategory',error);
    }
  };

  export const getSuspendExpense= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}SuspendExpense`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('SuspendExpense',error);
    }
  };

  export const getExpenseDetails= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetExpenseDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetExpenseDetails',error);
    }
  };


  export const postExpense = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostExpense`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostExpense',error);
    }
  };


  export const getPaymentSmmary= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}PaymentSmmary`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('PaymentSmmary',error);
    }
  };

  export const getBalance= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetBalance`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetBalance',error);
    }
  };

  export const getPaymentType= async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetPaymentType`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetPaymentType',error);
    }
  };

  export const deletePayment = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}DeletePayment`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('DeletePayment',error);
    }
  };

  export const getPaymentDetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetPaymentDetails`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetPaymentDetails',error);
    }
  };

  export const getAllPayment = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetAllPayment`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetAllPayment',error);
    }
  };

  export const getPendingPaymentList = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetPendingPaymentList`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetPendingPaymentList',error);
    }
  };

  export const postPayment = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostPayment`, payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      console.log('PostPayment',error);
    }
  };


  export const postAmount = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}PostAmount`, payload);
      return response?.data;
    } catch (error) {
      console.log('PostAmount',error);
    }
  };

  export const getSelfTransactions = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}GetSelfTransactions`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('GetSelfTransactions',error);
    }
  };

  export const postSelfTransactions = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}PostSelfTransactions`,{
        params: payload,
      });
      return response?.data;
    } catch (error) {
      console.log('PostSelfTransactions',error);
    }
  };

 //Get Leave ApplicationReport
 export const getLeaveApplicationReport = async (payload) => {
  try {
    const response = await axios.get(`${baseUrl}GetLeaveApplicationReport`, {
      params: payload,
    });
    return response?.data;
  } catch (error) {
    console.log('GetLeaveApplicationReport',error);
  }
};

  
  


 