import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to items page as the main dashboard view
  redirect("/items");
}
