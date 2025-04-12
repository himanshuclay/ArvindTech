import { Modal } from "react-bootstrap";
import axios from "axios";
import config from "@/config";
import { useEffect, useState } from "react";
import MessCards from "../../Component/Previous&Completed";


interface ProcessCanvasProps {
  show: boolean;
  setShow: (show: boolean) => void;
  manageId: any; // Ensure this is defined as a string
}
interface ProjectAssignListWithDoer {
  id: number;
  projectId: string;
  projectName: string;
  moduleID: string;
  moduleName: string;
  processID: string;
  processName: string;
  roleId: string;
  doerId: string;
  doerName: string;
  task_Json: string;
  task_Number: string;
  task_Status: 1;
  isExpired: 0;
  taskCommonId: number;
  expiredSummary: null;
  createdBy: string;
  status: 'Pending' | 'Done';
  isCompleted: 'Pending';
  condition_Json: string;
  createdDate: string;
  completedDate: string;
  taskTime: string;
  taskType: string;
  roleName: string;
  inputs: string;
  messID: string;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  getFilterTasks: ProjectAssignListWithDoer[];
}




const ProcessCanvas: React.FC<ProcessCanvasProps> = ({ show, setShow, manageId }) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [preData, setPreData] = useState<any>([]);

  const handleClose = () => {
    setShow(false);
  };



  useEffect(() => {

    fetchData(manageId);
  }, [show, manageId]);

  const fetchData = async (manageId: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`${config.API_URL_ACCOUNT}/ProcessInitiation/GetFilterTask`, {
        params: { flag: 10, id: manageId, }
      });
      if (response.data?.isSuccess) {
        const fetchedData = response.data.getFilterTasks || [];
        console.log(fetchedData);
  
        // Filter and transform data
        const filteredTasks = fetchedData
          .filter((task) => task.isCompleted !== "Pending") // Exclude pending tasks
          .flatMap((task: ProjectAssignListWithDoer) => {
            let taskJsonArray: any[] = [];
  
            try {
              taskJsonArray = JSON.parse(task.task_Json);
              console.log("Parsed taskJsonArray:", taskJsonArray);
            } catch (error) {
              console.error("Error parsing task_Json:", task.task_Json, error);
              return []; // Return an empty array if parsing fails
            }
  
            if (!Array.isArray(taskJsonArray)) {
              console.error("taskJsonArray is not an array:", taskJsonArray);
              console.log("task_Json is not in the expected array format:", task.task_Json);
              
              if (typeof taskJsonArray === "object" && taskJsonArray !== null) {
                console.log("task_Json is an object:", taskJsonArray);
                taskJsonArray = [taskJsonArray]; // Wrap the object in an array
              } else {
                return []; // If not an object or array, return an empty array
              }
            }
  
            // Proceed with the rest of the taskJsonArray processing
            return taskJsonArray.flatMap((taskJson: any) => {
              if (!taskJson) {
                console.error("Invalid taskJson:", taskJson);
                return [];
              }
  
              // Extract inputs from the appropriate structure
              const inputs = taskJson.taskJson?.inputs || taskJson.inputs;
              if (!Array.isArray(inputs)) {
                console.error("Invalid inputs:", inputs);
                return [];
              }
              console.log(inputs);
  
              // Map options for replacing value with label
              const optionsMap = inputs.reduce((map: Record<string, string>, input: any) => {
                if (input.options) {
                  input.options.forEach((option: any) => {
                    map[option.id] = option.label;
                  });
                }
                return map;
              }, {});
  
              // Filter and map inputs
              const filteredInputsData = inputs
                .filter((input: any) => !["99", "100", "102", "103"].includes(input.inputId)) // Exclude unwanted inputs
                .map((input: any) => ({
                  label: input.label,
                  value: optionsMap[input.value] || input.value, // Replace value with label if available
                }));
  
              // Return transformed task object
              return {
                messID: taskJson.messID,
                messName: taskJson.messName || 'Mess',
                messManager: taskJson.messManager,
                managerNumber: taskJson.mobileNumber,
                messTaskNumber: taskJson.messTaskNumber,
                inputs: filteredInputsData,
              };
            });
          });
  
        setPreData(filteredTasks);
        console.log("Filtered Tasks:", filteredTasks);
      } else {
        console.error("API Response Error:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
    finally {
      setLoading(false);
    }
  };




  return (
    <div>
      <Modal size="xl" className="p-2" show={show} placement="end" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className='loader-container'>
              <div className="loader"></div>
              <div className='mt-2'>Please Wait!</div>
            </div>
          ) : (

            <MessCards data={preData} />

          )}

        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProcessCanvas;

