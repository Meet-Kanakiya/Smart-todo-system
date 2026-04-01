import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

export const sendOTPEmail = async (email, otp) => {
  const serviceID = "service_8bgg1j5";   // 🔹 Replace with your actual Service ID
  const templateID = "template_9j610x9"; // 🔹 Replace with your actual Template ID
  const userID = "NJ8hDvZa3XDWnbBRS";     // 🔹 Found under Account > API Keys

  const templateParams = {
    app_name: "Smart Todo System",
    to_email: email,
    otp: otp,
  };

  try {
    const response = await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log("✅ Email sent:", response.status, response.text);
    Swal.fire({
      icon: "success",
      title: "OTP Sent!",
      text: `OTP sent to ${email}. Please check your inbox.`,
      confirmButtonColor: "#007bff",
    });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    Swal.fire({
      icon: "error",
      title: "Failed to send OTP",
      text: "Please check console for more details.",
      confirmButtonColor: "#d33",
    });
  }
};