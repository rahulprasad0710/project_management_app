import { useParams } from "react-router-dom";

const BookingInvoicePage = () => {
    const { bookingId } = useParams();

    console.log({
        bookingId,
    });
    return <div>BookingInvoicePage</div>;
};

export default BookingInvoicePage;
