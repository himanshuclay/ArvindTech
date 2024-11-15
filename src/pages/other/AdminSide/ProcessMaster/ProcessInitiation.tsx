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
            {/* {processID === 'ACC.01' ? <Acc01 /> :
                    processID === 'ACC.02' ? <Acc02 /> :
                        processID === 'ACC.03' ? <Acc03 /> :
                            processID === 'ACC.04' ? <Acc04 /> :
                                processID === 'ACC.05' ? <Acc05 /> :
                                    processID === 'BD.01' ? <BD01 /> :
                                        processID === 'BD.02' ? <BD02 /> :
                                            processID === 'BD.03' ? <BD03 /> :
                                                processID === 'BD.04' ? <BD04 /> :
                                                    processID === 'BD.05' ? <BD05 /> :
                                                        processID === 'BD.06' ? <BD06 /> :
                                                            processID === 'BD.07' ? <BD07 /> :
                                                            processID === 'BD.07' ? <BD07 /> :

                                                                null} */}




        </>
    );
};

export default ProcessInitiation;