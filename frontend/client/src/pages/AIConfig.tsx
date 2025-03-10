import Header from "../components/layout/Header";
import APIKeyForm from "../components/ai/APIKeyForm";

export default function AIConfig() {
  return (
    <div className="p-6">
      <Header title="AI Model Configuration" />
      <APIKeyForm />
    </div>
  );
}
