import "./Tables.scss";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Axios from "axios";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Tables = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await Axios.get("http://localhost:5555/consults");
        setRows(
          response.data.map((consult) => ({
            id: consult._id,
            patientId: consult.patientReference._id,
            lastName: consult.patientReference.lastName,
            firstName: consult.patientReference.firstName,
            age: consult.patientReference.age,
            diagnosis: consult.diagnosis,
            doctorReq: consult.patientReference.doctorAssigned,
            phoneNumber: consult.phoneNumber,
            status: consult.status,
            date: consult.date,
          }))
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInfo();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 125 },
    { field: "patientId", headerName: "PatientId", width: 100 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 50,
    },
    { field: "diagnosis", headerName: "Diagnosis", width: 130 },
    { field: "doctorReq", headerName: "Doctor Requesting", width: 150 },
    { field: "phoneNumber", headerName: "Phone Number", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 90,
      cellClassName: (params) => {
        if (params.value === "routine") {
          return "status-routine";
        } else if (params.value === "stat") {
          return "status-stat";
        } else {
          return "status-default";
        }
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => handleViewClick(params.row.patientId)}
            >
              View
            </div>
            <div
              className="completeButton"
              onClick={() => handleCompleteClick(params.row.id)}
            >
              Complete
            </div>
          </div>
        );
      },
    },
  ];

  const navigate = useNavigate();

  const handleViewClick = (patientId) => {
    navigate(`/users/${patientId}`);
  };

  const handleCompleteClick = async (consultId) => {
    try {
      // Making an API call to the delete endpoint
      await Axios.post("http://localhost:5555/consults/historyconsult", {
        id: consultId,
      });

      // Updating the state to remove the deleted consultation
      setRows(rows.filter((row) => row.id !== consultId));

      // Optionally, display a success message or update the UI accordingly
    } catch (error) {
      console.error("Error completing consultation:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: {
              page: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
