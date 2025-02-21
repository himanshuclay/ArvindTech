import { useParams } from 'react-router-dom';
import AccountProcess from './ProcessModule/AccountProcess/AccountProcess';
import BuisnessDevelopmentProcess from './ProcessModule/BuisnessDevelopmentProcess/BuisnessDevelopmentProcess';
import HumanResource from './ProcessModule/HumanResource/HumanResource';
import MDO from './ProcessModule/MDO/MDO';
import PB from './ProcessModule/PB/PB';


const ProcessManualInitiation = () => {
    const { moduleID } = useParams<{ moduleID: string }>();


    return (
        <>
            {moduleID === 'ACC' ? <AccountProcess /> :
                moduleID === 'BD' ? <BuisnessDevelopmentProcess /> :
                    moduleID === 'HR' ? <HumanResource /> :
                        moduleID === 'MDO' ? <MDO /> :
                            moduleID === 'PB' ? <PB /> :
                                null}

        </>
    );
};

export default ProcessManualInitiation;