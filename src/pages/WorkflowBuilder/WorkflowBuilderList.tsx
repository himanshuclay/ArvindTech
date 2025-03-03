import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const WorkflowBuilderList = () => {
  return (
    <>
      <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
        <span><i className="ri-file-list-line me-2"></i><span className='fw-bold test-nowrap'>Workflow List</span></span>
        <div className="d-flex">
          <Link to='/pages/WorkflowBuilder'>
            <Button variant="primary" className="">
              Add Workflow
            </Button>
          </Link>

        </div>
      </div>
      <Table className='bg-white mt-3' striped bordered hover>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Form Name</th>
            <th>Task Type</th>
            <th>Planned Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </Table>
    </>
  )
}

export default WorkflowBuilderList
