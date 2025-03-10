import Header from "../components/layout/Header";
import UploadForm from "../components/triggers/UploadForm";

export default function Triggers() {
  return (
    <div className="p-6">
      <Header title="Triggers and Response Calls" />
      <UploadForm />
    </div>
  );
}
