import React from "react";

const TermsAndConditions = () => {
  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw", // Use viewport width to ensure full screen coverage
        boxSizing: "border-box", // Ensure padding doesn't affect width
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          width: "100%", // Take full width of parent (outer div)
          maxWidth: "1200px", // Optional: Increase or remove maxWidth for wider content
          padding: "2.5rem",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          color: "#333",
          lineHeight: "1.7",
          boxSizing: "border-box", // Ensure padding doesn't affect width
        }}
      >
        <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "#1a1a1a" }}>
          Terms and Conditions
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#666" }}>Last updated: July 14, 2025</p>

        <hr style={{ margin: "1.5rem 0" }} />

        {[
          {
            title: "1. Acceptance of Terms",
            text: `By accessing and using our Instagram posting service, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the service.`,
          },
          {
            title: "2. Use of Service",
            text: `Our platform allows you to authenticate with Instagram and post content on your behalf. You are responsible for any content you submit and must not violate any laws or Instagram's terms.`,
          },
          {
            title: "3. Account & Access",
            text: `To use our features, you must log in using your Instagram account. You are solely responsible for maintaining the confidentiality of your access credentials.`,
          },
          {
            title: "4. Content Ownership",
            text: `You retain full ownership of all content you post using our service. However, you grant us permission to transmit your content through Instagram's API as required.`,
          },
          {
            title: "5. Prohibited Activities",
            text: `You agree not to misuse the service by uploading spam, illegal content, abusive messages, or violating Instagram's community guidelines.`,
          },
          {
            title: "6. Termination",
            text: `We reserve the right to suspend or terminate your access at any time for any violation of these terms or misuse of our services.`,
          },
          {
            title: "7. Disclaimer",
            text: `We are not affiliated with Instagram or Meta. This service uses Instagram’s Graph API under permitted scopes. We do not store your login credentials.`,
          },
          {
            title: "8. Limitation of Liability",
            text: `We are not liable for any indirect or consequential damages arising from the use of this service. Use the platform at your own risk.`,
          },
          {
            title: "9. Changes to Terms",
            text: `We may update these terms occasionally. Continued use of the service after updates means you accept the revised terms.`,
          },
          {
            title: "10. Contact Us",
            text: `If you have any questions about these Terms, please contact us at `,
            email: "support@myoffshoreemployees.com",
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: "1.8rem" }}>
            <h3 style={{ color: "#222", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
              {section.title}
            </h3>
            <p>
              {section.text}
              {section.email && (
                <a
                  href={`mailto:${section.email}`}
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                    marginLeft: "4px",
                  }}
                >
                  {section.email}
                </a>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;