import { useParams } from 'react-router-dom';
import AccountProcess from './ProcessModule/AccountProcess/AccountProcess';
import BuisnessDevelopmentProcess from './ProcessModule/BuisnessDevelopmentProcess/BuisnessDevelopmentProcess';
import HumanResource from './ProcessModule/HumanResource/HumanResource';

const ProcessManualInitiation = () => {
    const { moduleID } = useParams<{ moduleID: string }>();


    return (
        <>
            {moduleID === 'ACC' ? <AccountProcess /> :
                moduleID === 'BD' ? <BuisnessDevelopmentProcess /> :
                    moduleID === 'HR' ? <HumanResource /> :
                        null}

        </>
    );
};

export default ProcessManualInitiation;