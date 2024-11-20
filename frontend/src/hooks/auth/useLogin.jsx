import { useState, useEffect } from 'react';

const useLogin = () => {
    const [errorRut, setErrorRut] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [inputData, setInputData] = useState({ rut: '', password: '' });

    useEffect(() => {
        if (inputData.rut) setErrorRut('');
        if (inputData.password) setErrorPassword('');
    }, [inputData.rut, inputData.password]);

    const errorData = (dataMessage) => {
        if (dataMessage.dataInfo === 'rut') {
            setErrorRut(dataMessage.message);
        } else if (dataMessage.dataInfo === 'password') {
            setErrorPassword(dataMessage.message);
        }
    };

    const handleInputChange = (field, value) => {
        setInputData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return {
        errorRut,
        errorPassword,
        inputData,
        errorData,
        handleInputChange,
    };
};

export default useLogin;
