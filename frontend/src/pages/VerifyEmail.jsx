import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from "react-toastify";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Missing verification token.');
                return;
            }

            try {
                const response = await axios.post(`/api/users/verify?token=${token}`,{},{
                    withCredentials : true
                });
                
                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Your email has been successfully verified!');
                    toast.success(response.data.message);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
                toast.error(error.response?.data?.message);
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transition-all">
                
                {status === 'loading' && (
                    <div className="space-y-4">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying your email</h2>
                        <p className="text-gray-500">Please wait while we validate your request...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
                            <p className="text-gray-500">{message}</p>
                        </div>
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            Go to Login <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
                            <p className="text-gray-500">{message}</p>
                        </div>
                        <button 
                            onClick={() => navigate('/resend-verification')}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;