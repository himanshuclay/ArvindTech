import { useParams } from 'react-router-dom';
import AccountProcess from './ProcessModule/AccountProcess/AccountProcess';
import BuisnessDevelopmentProcess from './ProcessModule/BuisnessDevelopmentProcess/BuisnessDevelopmentProcess';

const ProcessInitiation = () => {
    const { processID } = useParams<{ processID: string }>();
    const { moduleID } = useParams<{ moduleID: string }>();

    console.log(processID)
    console.log(moduleID)

    return (
        <>
            {moduleID === 'ACC' ? <AccountProcess /> :
                moduleID === 'BD' ? <BuisnessDevelopmentProcess /> :
                    null}
            
        </>
    );
};

export default ProcessInitiation;