import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';






const DesignationMaster = () => {


    const role = localStorage.getItem('role');




    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center">
                <span><i className="ri-file-list-line me-2 text-dark fs-16"></i><span className='fw-bold text-dark fs-15'>Common Master List</span></span>

            </div>




            <>


                <div className="overflow-auto text-nowrap">
                    <Table hover className='bg-white '>
                        <thead>
                            <tr>
                                <th> Sr. no</th>
                                <th> <i className="ri-settings-2-line"></i> Master</th>
                                <th><i className="ri-eye-line"></i> View</th>
                                {(role === 'Admin' || role === 'DME') && (
                                    <th><i className="ri-tools-line"></i> Action</th>)}
                            </tr>

                        </thead>
                        <tbody>

                            <tr>

                                <td>1</td>
                                <td>Departement Master</td>
                                <td> <Link to='/pages/departmentMaster'> <Button> <i className="ri-eye-line"></i>  </Button> </Link> </td>
                                {(role === 'Admin' || role === 'DME') && (
                                    <td> <Link to='/pages/departmentMasterinsert'> <Button> Add Data </Button> </Link> </td>)}


                            </tr>
                            <tr>

                                <td>2</td>
                                <td>Filling Frequency</td>
                                <td> <Link to='/pages/FillingFrequencyMaster'> <Button> <i className="ri-eye-line"></i>  </Button> </Link> </td>
                                {(role === 'Admin' || role === 'DME') && (
                                    <td> <Link to='/pages/FillingFrequencyMasterinsert'> <Button> Add Data </Button> </Link> </td>)}



                            </tr>
                            <tr>

                                <td>3</td>
                                <td>Management Contract Master</td>
                                <td> <Link to='/pages/ManagementContractMaster'> <Button> <i className="ri-eye-line"></i>  </Button> </Link> </td>
                                {(role === 'Admin' || role === 'DME') && (
                                    <td> <Link to='/pages/ManagementContractMasterinsert'> <Button> Add Data </Button> </Link> </td>)}

                            </tr>
                            <tr>

                                <td>4</td>
                                <td>Project Type Master</td>
                                <td> <Link to='/pages/ProjectTypeMaster'> <Button> <i className="ri-eye-line"></i>  </Button> </Link> </td>
                                {(role === 'Admin' || role === 'DME') && (
                                    <td> <Link to='/pages/ProjectTypeMasterinsert'> <Button> Add Data </Button> </Link> </td>)}


                            </tr>
                        </tbody>

                    </Table>
                </div>
            </>


        </>
    );
};

export default DesignationMaster;