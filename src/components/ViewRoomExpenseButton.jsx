import { Link } from 'react-router-dom';

const ViewRoomExpenseButton = () => {
  return (
    <div className="text-center">
      <Link 
        to="/room-expense-details" 
        className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg transition duration-200 ease-in-out"
      >
        Xem chi tiết chi tiêu phòng
      </Link>
    </div>
  );
};

export default ViewRoomExpenseButton;
