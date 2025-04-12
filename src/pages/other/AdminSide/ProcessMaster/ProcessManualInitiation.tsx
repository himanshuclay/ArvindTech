import { useParams } from 'react-router-dom';
import AccountProcess from './ProcessModule/AccountProcess/AccountProcess';
import BuisnessDevelopmentProcess from './ProcessModule/BuisnessDevelopmentProcess/BuisnessDevelopmentProcess';
import HumanResource from './ProcessModule/HumanResource/HumanResource';
import MDO from './ProcessModule/MDO/MDO';
import StoreManagement from './ProcessModule/StoreManagement/StoreManagement';
import Demobilization from './ProcessModule/Demobilization/Demobilization';
import DDPS from './ProcessModule/DDPS/DDPS';
import BillTrackingSystem from './ProcessModule/BillTrackingSystem/BillTrackingSystem';
import PB from './ProcessModule/PB/PB';
import TestingModule from './ProcessModule/TestingModule/TestingModule';


const ProcessManualInitiation = () => {
    const { moduleID } = useParams<{ moduleID: string }>();


    return (
        <>
            {moduleID === 'ACC' ? <AccountProcess /> :
                moduleID === 'BD' ? <BuisnessDevelopmentProcess /> :
                    moduleID === 'HR' ? <HumanResource /> :
                        moduleID === 'MDO' ? <MDO /> :
                            moduleID === 'SM' ? <StoreManagement /> :
                                moduleID === 'DDPS' ? <DDPS /> :
                                    moduleID === 'DEMOB' ? <Demobilization /> :
                                        moduleID === 'BTS' ? <BillTrackingSystem /> :
                                            moduleID === 'PB' ? <PB /> :
                                                moduleID === 'tm1' ? <TestingModule /> :
                                                    null}

        </>
    );
};

export default ProcessManualInitiation;