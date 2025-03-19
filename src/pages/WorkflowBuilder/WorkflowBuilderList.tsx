import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Pagination, Table, Container, Row, Col, Alert, Form, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import config from '@/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



interface Mess {
  id: number,
  name: string,
  createdDate: string,
  createdBy: string,
  updatedDate: string,
  updatedBy: string

}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface MessList {
  messId: string;
  messName: string;
}




const WorkflowBuilderList = () => {
  const role = localStorage.getItem('role');

  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setMessList] = useState<MessList[]>([]);
  const [searchTriggered,] = useState(false);



  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.dismiss()
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);



  const [columns, setColumns] = useState<Column[]>([

    { id: 'name', label: 'Name', visible: true },
    { id: 'createdDate', label: 'Created Date', visible: true },
    { id: 'createdBy', label: 'Created By', visible: true },
    { id: 'updatedDate', label: 'Updated Date', visible: true },
    { id: 'updatedBy', label: 'Updated By', visible: true },
  ]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);
    setColumns(reorderedColumns);
  };




  useEffect(() => {
    if (searchTriggered || currentPage) {
      handleSearch();
    } else {
      fetchRoles();
    }
  }, [currentPage, searchTriggered]);


  const [searchMessName,] = useState('')
  const [searchStatus,] = useState('')
  const [searchProjectName,] = useState('')


  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let query = `?`;
    if (searchMessName) query += `MessName=${searchMessName}&`;
    if (searchStatus) query += `Status=${searchStatus}&`;
    if (searchProjectName) query += `ProjectName=${searchProjectName}&`;
    query += `PageIndex=${currentPage}`;

    query = query.endsWith('&') ? query.slice(0, -1) : query;
    const apiUrl = `${config.API_URL_ACCOUNT}/WorkflowBuilder/GetWorkflowBuilder${query}`;
    console.log(apiUrl)
    axios.get(apiUrl, { headers: { 'accept': '*/*' } })
      .then((response) => {
        console.log("search response ", response.data);
        setMesses(response.data.workflowBuilderLists)
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL_APPLICATION1}/DrawingMaster/GetDrawing`, {
        params: { PageIndex: currentPage }
      });
      console.log('response', response)
      if (response.data.isSuccess) {
        setMesses(response.data.workflowBuilderLists);
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching doers:', error);
    }
    finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    const fetchData = async (endpoint: string, setter: Function, listName: string) => {
      try {
        const response = await axios.get(`${config.API_URL_APPLICATION1}/${endpoint}`);
        console.log('response', response)
        if (response.data.isSuccess) {
          setter(response.data[listName]);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    };

    fetchData('DrawingMaster/GetDrawing', setMessList, 'workflowBuilderLists');

  }, []);




  const handleVisibilityChange = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };


  return (
    <>
      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
        <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Workflow List</span></span>
        <div className="d-flex justify-content-end  ">

          {(role === 'Admin' || role === 'DME') && (

            <Link to='/pages/WorkflowBuilder'>
              <Button variant="primary" className="me-2">
                Add Workflow
              </Button>
            </Link>)}

        </div>
      </div>

      <div className='bg-white p-2 pb-2'>




        <Row className='mt-3'>
          <div className="d-flex justify-content-end bg-light p-1">
            <div className=" me-4">
              <DropdownButton title="Toggle Columns" className="">
                {columns.map(column => (
                  <Form.Check
                    key={column.id}
                    type="checkbox"
                    id={`toggle-${column.id}`}
                    label={column.label}
                    checked={column.visible}
                    onChange={() => handleVisibilityChange(column.id)}
                  />
                ))}
              </DropdownButton>
            </div>


          </div>
        </Row>
      </div>
      {loading ? (
        <div className='loader-container'>
          <div className="loader"></div>
          <div className='mt-2'>Please Wait!</div>
        </div>
      ) : (<>


        <div className="overflow-auto text-nowrap">
          {!messes ? (
            <Container className="mt-5">
              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                  <Alert variant="info" className="text-center">
                    <h4>No Task Found</h4>
                    <p>You currently don't have Completed tasks</p>
                  </Alert>
                </Col>
              </Row>
            </Container>
          ) : (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Table hover className='bg-white '>
                <thead>
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr {...provided.droppableProps} ref={provided.innerRef as React.Ref<HTMLTableRowElement>}>
                        <th><i className="ri-list-ordered-2"></i>  Sr. No</th>
                        {columns.filter(col => col.visible).map((column, index) => (
                          <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                              <th>
                                <div ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>


                                  &nbsp; {column.label}
                                </div>
                              </th>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {(role === 'Admin' || role === 'DME') && (

                          <th>Action</th>)}
                      </tr>
                    )}
                  </Droppable>
                </thead>
                <tbody>
                  {messes.length > 0 ? (
                    messes.slice(0, 10).map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        {columns.filter(col => col.visible).map((col) => (
                          <td key={col.id}
                          >

                            {item[col.id as keyof Mess]}

                          </td>
                        ))}
                        {(role === 'Admin' || role === 'DME') && (


                          <td>
                            <Link to={`/pages/WorkflowBuilder/${item.id}`}>
                              <Button variant='primary' className='p-0 text-white'>
                                <i className='btn ri-edit-line text-white' ></i>
                              </Button>
                            </Link>
                            <Link to={`/pages/Workflow/${item.id}`}>
                              <Button variant='primary' className='p-0 text-white'>
                                <i className='btn ri-eye-2-line text-white' ></i>
                              </Button>
                            </Link>
                          </td>)}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12}>
                        <Container className="mt-5">
                          <Row className="justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                              <Alert variant="info" className="text-center">
                                <h4>No Data Found</h4>
                                <p>You currently don't have any Data</p>
                              </Alert>
                            </Col>
                          </Row>
                        </Container>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </DragDropContext>
          )}
        </div>
      </>
      )}

      <div className="d-flex justify-content-center align-items-center bg-white w-20 rounded-5 m-auto py-1 pb-1 my-2 pagination-rounded">
        <Pagination >
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>


    </>
  );
};

export default WorkflowBuilderList;