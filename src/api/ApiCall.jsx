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
      console.log(payload);
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


 