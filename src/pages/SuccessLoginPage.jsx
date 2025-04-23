import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import AddPaymentForm from '../components/AddPaymentForm';

const SuccessPage = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // This effect is no longer needed as we're removing the token
  }, [location]);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleGoBack = () => {
    setShowForm(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-teal-100">
      <div className="text-center max-w-md w-full px-6 space-y-8">
        {/* Animated heading */}
        <motion.h1
          className="text-4xl font-bold text-green-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Tiền phòng 703
        </motion.h1>

        {/* Animated subheading */}
        <motion.p
          className="text-md sm:text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          You've successfully logged in.
        </motion.p>

        <div className="mt-6">
          {!showForm ? (
            <motion.button
              onClick={handleShowForm}
              className="px-8 py-4 bg-blue-500 text-black rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition duration-200 ease-in-out shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Thêm tiền chi tiêu trong tháng
            </motion.button>
          ) : (
            <AddPaymentForm onCancel={handleGoBack} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
