import { useParams } from "react-router-dom";

export default function ClientBookingPage() {
  const { ownerId } = useParams();
  return (
    <div>
      <h1>Client Booking Page</h1>
      <p>Owner ID: {ownerId}</p>
    </div>
  );
}
