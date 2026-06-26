import axios from "axios";
import { serverUrl } from "../App";
import { setuserdata } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(
      serverUrl + "/api/user/currentUser",
      {
        withCredentials: true,
      }
    );

    dispatch(setuserdata(result.data));
  } catch (err) {
    console.error("Current User Error:", err);
    dispatch(setuserdata(null));
  }
};

export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/notes/generate-notes",
      payload,
      {
        withCredentials: true,
      }
    );

    return result.data;
  } catch (err) {
    console.error("Generate Notes Error:", err);
    throw err;
  }
};


export const pdfDownload = async (result) => {
  if (!result) {
    console.error("No result data available to download.");
    return;
  }

  try {

    const pdfResponse = await axios.post(
      serverUrl + "/api/pdf/download-pdf",
      {
        title: "Exam Study Guide",
        notes: result.notes,
        revisionPoints: result.revisionPoints,
        questions: result.questions
      },
      {
        responseType: 'blob',
        withCredentials: true
      }
    );

    const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `ExamNotes-Export.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

  } catch (err) {
    console.error("PDF Download handling layer crashed:", err);
  }
};