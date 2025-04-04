/*
 * Contact Form with EmailJS Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://www.emailjs.com/ and sign in to your account
 * 2. Create a new template by going to Email Templates > Create New Template
 * 3. Name your template anything you want (e.g. "Portfolio Contact")
 * 4. In the template HTML, paste this code:
 *    <div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
 *      <div>A message by {'{{from_name}}'} has been received. Kindly respond at your earliest convenience.</div>
 *      <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: lightgrey;">
 *        <table role="presentation">
 *          <tr>
 *            <td style="vertical-align: top">
 *              <div style="padding: 6px 10px; margin: 0 10px; background-color: aliceblue; border-radius: 5px; font-size: 26px;" role="img">&#x1F464;</div>
 *            </td>
 *            <td style="vertical-align: top">
 *              <div style="color: #2c3e50; font-size: 16px"><strong>{'{{from_name}}'}</strong> - <span style="color: #3498db;">{'{{from_email}}'}</span></div>
 *              <div style="color: #cccccc; font-size: 13px">Subject: {'{{subject}}'}</div>
 *              <p style="font-size: 16px">{'{{message}}'}</p>
 *            </td>
 *          </tr>
 *        </table>
 *      </div>
 *    </div>
 * 
 * 5. In the template variables section, make sure you have these variables:
 *    - {'{{from_name}}'}
 *    - {'{{from_email}}'}
 *    - {'{{subject}}'}
 *    - {'{{message}}'}
 * 
 * 6. Save the template and copy the template ID (it will look like "template_abc123")
 * 7. Copy your service ID from Email Services page
 * 8. Copy your public key from Account > API Keys
 * 9. Update the variables below with your actual IDs
 */

import React from 'react'
import styled from 'styled-components'
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
position: relative;
z-index: 1;
align-items: center;
@media (max-width: 960px) {
    padding: 0px;
}
`

const Wrapper = styled.div`
position: relative;
display: flex;
justify-content: space-between;
align-items: center;
flex-direction: column;
width: 100%;
max-width: 1350px;
padding: 0px 0px 80px 0px;
gap: 12px;
@media (max-width: 960px) {
    flex-direction: column;
}
`

const Title = styled.div`
font-size: 42px;
text-align: center;
font-weight: 600;
margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
      margin-top: 12px;
      font-size: 32px;
  }
`;

const Desc = styled.div`
    font-size: 18px;
    text-align: center;
    max-width: 600px;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 16px;
    }
`;


const ContactForm = styled.form`
  width: 95%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  margin-top: 28px;
  gap: 16px;
`

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`

const ContactInfo = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    box-shadow: 0 0 8px rgba(133, 76, 230, 0.5);
  }
`

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  min-height: 120px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    box-shadow: 0 0 8px rgba(133, 76, 230, 0.5);
  }
`

const ContactButton = styled.button`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  background: -moz-linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  background: -webkit-linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 20px rgba(133, 76, 230, 0.6);
  }
  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.text_secondary + 30};
  margin: 8px 0;
`

const SetupAlert = styled.div`
  background-color: #FDECEA;
  color: #611A15;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`

const InfoAlert = styled.div`
  background-color: #E3F2FD;
  color: #0D47A1;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`

const TroubleshootingGuide = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #EDE7F6;
  border-radius: 8px;
  border-left: 4px solid #7E57C2;
`

const TroubleshootingTitle = styled.h3`
  margin-top: 0;
  color: #4527A0;
  font-size: 16px;
`

const TroubleshootingStep = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

const StepNumber = styled.div`
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #7E57C2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`

const SetupLink = styled.a`
  color: #9C27B0;
  text-decoration: underline;
  font-weight: 500;
`

const EmailJSSetupInfo = ({ serviceId, templateId, publicKey }) => (
  <SetupAlert>
    <strong>EmailJS Template Not Found!</strong> 
    <div style={{ marginTop: "8px", marginBottom: "8px" }}>
      The form is configured but the template ID was not found. Follow these steps:
    </div>
    <ol style={{ marginLeft: "20px", marginTop: "8px" }}>
      <li>Go to <SetupLink href="https://dashboard.emailjs.com/admin/templates" target="_blank">EmailJS Templates</SetupLink></li>
      <li>Click "Create New Template"</li>
      <li>Copy the HTML template from the comment at the top of this file</li>
      <li>Make sure to use these exact variable names in your template:
        <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
          <li><code>{'{{from_name}}'}</code></li>
          <li><code>{'{{from_email}}'}</code></li>
          <li><code>{'{{subject}}'}</code></li>
          <li><code>{'{{message}}'}</code></li>
        </ul>
      </li>
      <li>After saving, check that your Template ID matches what's in the code:</li>
      <code style={{ display: "block", padding: "8px", margin: "8px 0", backgroundColor: "#222", color: "#fff", borderRadius: "4px" }}>
        Service ID: {serviceId}<br/>
        Template ID: {templateId}<br/>
        Public Key: {publicKey?.substring(0, 5)}...
      </code>
    </ol>
  </SetupAlert>
)

const CredentialsForm = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #FFF8E1;
  border-radius: 8px;
  border-left: 4px solid #FFA000;
`

const CredentialsTitle = styled.h3`
  margin-top: 0;
  color: #E65100;
  font-size: 16px;
`

const CredentialsInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`

const CredentialsButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #1976D2;
  }
`

const Contact = () => {
  // EmailJS credentials - defaults that should be updated
  // Get these from https://dashboard.emailjs.com/admin
  const [credentials, setCredentials] = useState({
    templateId: "template_28g8p3s", // Updated with your new template ID
    serviceId: "service_ctyayi3",   // This should be your service ID
    publicKey: "jThJ11wIKTUp6lWtw"  // This should be your public key
  });

  // State to show credential form
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);

  // Update credentials
  const updateCredentials = (e) => {
    e.preventDefault();
    localStorage.setItem('emailjs_credentials', JSON.stringify(credentials));
    setShowCredentialsForm(false);
    // Reload EmailJS with new credentials
    emailjs.init(credentials.publicKey);
  };

  // Load saved credentials on mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('emailjs_credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        setCredentials(parsed);
      } catch (e) {
        console.error("Failed to parse saved credentials:", e);
      }
    }
  }, []);

  // Check if EmailJS credentials follow the correct format pattern
  const isValidTemplateIdFormat = /^template_[a-z0-9]{6,}$/.test(credentials.templateId);
  const isValidServiceIdFormat = /^service_[a-z0-9]{6,}$/.test(credentials.serviceId);
  const isValidPublicKeyFormat = /^[a-zA-Z0-9]{12,}$/.test(credentials.publicKey);
  
  // Show configuration warnings if format is wrong
  const hasConfigurationIssue = !isValidTemplateIdFormat || !isValidServiceIdFormat || !isValidPublicKeyFormat;
  const configIssueDetails = !isValidTemplateIdFormat ? "Template ID format is incorrect" : 
                            !isValidServiceIdFormat ? "Service ID format is incorrect" : 
                            "Public Key format is incorrect";

  // Check if EmailJS credentials are set
  const isEmailJSConfigured = true; // We know you've set the credentials
  
  // Hooks
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Failed to send message. Please try again.");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });
  const form = useRef();
  
  // Initialize EmailJS once on component mount
  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init(credentials.publicKey);
  }, [credentials.publicKey]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Form validation
    if (!formData.from_name || !formData.from_email || !formData.message) {
      setError(true);
      setErrorMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Prepare template parameters
    const templateParams = {
      from_name: formData.from_name,
      from_email: formData.from_email,
      subject: formData.subject || "No Subject",
      message: formData.message
    };

    console.log("Sending email with the following parameters:", {
      serviceId: credentials.serviceId,
      templateId: credentials.templateId,
      templateParams,
      publicKey: credentials.publicKey.substring(0, 5) + "..." // Only log partial key for security
    });

    // Use send method instead of sendForm
    emailjs.send(
      credentials.serviceId,
      credentials.templateId, 
      templateParams,
      credentials.publicKey
    )
    .then((result) => {
      console.log("Email sent successfully:", result);
      setOpen(true);
      setError(false);
      setLoading(false);
      // Reset form
      setFormData({
        from_name: '',
        from_email: '',
        subject: '',
        message: ''
      });
    }, (error) => {
      console.error("Failed to send email:", error);
      setError(true);
      
      // Set appropriate error message
      if (error.text && error.text.includes("template")) {
        console.log("Template error detected. Your template ID is:", credentials.templateId);
        setErrorMessage(`Template error: ${error.text}. Check that your template exists and includes variables: from_name, from_email, subject, message.`);
      } else if (error.text && error.text.includes("service")) {
        console.log("Service error detected. Your service ID is:", credentials.serviceId);
        setErrorMessage(`Service error: ${error.text}. Check that your service is active and properly configured.`);
      } else {
        console.log("Unknown error with parameters:", { 
          serviceId: credentials.serviceId, 
          templateId: credentials.templateId, 
          publicKey: credentials.publicKey.substring(0, 5) + "..." 
        });
        setErrorMessage(`Error: ${error.text || "Unknown error occurred"}. Please verify all EmailJS settings.`);
      }
      
      // Additional information about what to check
      console.log("Please verify:");
      console.log("1. Your template ID matches EXACTLY what's in EmailJS dashboard");
      console.log("2. Your template includes variables: from_name, from_email, subject, message");
      console.log("3. Your service is connected and active");
      
      setLoading(false);
    });
  }

  // After the error detection
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    // Show troubleshooting guide when there's a template error
    if (error && errorMessage && errorMessage.includes("template")) {
      setShowTroubleshooting(true);
    }
    
    // Reset troubleshooting guide when form is successful
    if (open) {
      setShowTroubleshooting(false);
    }
  }, [error, errorMessage, open]);

  return (
    <Container id="contact">
      <Wrapper>
        <Title>Get In Touch</Title>
        <Desc>Feel free to reach out for collaborations, opportunities, or just to say hello!</Desc>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Send Me a Message</ContactTitle>
          <ContactInfo>
            <span>📧</span> Email: vamsikrishnathota483@gmail.com
          </ContactInfo>
          <ContactInfo>
            <span>📱</span> Phone: +91 8074046062
          </ContactInfo>
          <Divider />
          
          {!isEmailJSConfigured && <EmailJSSetupInfo serviceId={credentials.serviceId} templateId={credentials.templateId} publicKey={credentials.publicKey} />}
          {hasConfigurationIssue && 
            <SetupAlert>
              <strong>Configuration Issue!</strong> 
              <div style={{ marginTop: "8px" }}>
                {configIssueDetails}. Please check your EmailJS configuration.
              </div>
              <div style={{ marginTop: "8px", fontStyle: "italic" }}>
                Your template ID should look like: template_abc123<br/>
                Your service ID should look like: service_xyz789
              </div>
              <button
                onClick={() => setShowCredentialsForm(true)}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#7E57C2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Configure EmailJS Credentials
              </button>
            </SetupAlert>
          }
          
          {/* EmailJS Credentials Form */}
          {showCredentialsForm && (
            <CredentialsForm>
              <CredentialsTitle>Update EmailJS Credentials</CredentialsTitle>
              <p>Enter your EmailJS credentials from your dashboard:</p>
              
              <label htmlFor="templateId">Template ID:</label>
              <CredentialsInput
                id="templateId"
                value={credentials.templateId}
                onChange={(e) => setCredentials({...credentials, templateId: e.target.value})}
                placeholder="template_abc123"
              />
              
              <label htmlFor="serviceId">Service ID:</label>
              <CredentialsInput
                id="serviceId"
                value={credentials.serviceId}
                onChange={(e) => setCredentials({...credentials, serviceId: e.target.value})}
                placeholder="service_xyz789"
              />
              
              <label htmlFor="publicKey">Public Key:</label>
              <CredentialsInput
                id="publicKey"
                value={credentials.publicKey}
                onChange={(e) => setCredentials({...credentials, publicKey: e.target.value})}
                placeholder="YOUR_PUBLIC_KEY"
              />
              
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <CredentialsButton onClick={updateCredentials}>
                  Save Credentials
                </CredentialsButton>
                <button
                  onClick={() => setShowCredentialsForm(false)}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </CredentialsForm>
          )}
          
          {/* Error recovery button */}
          {error && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button
                onClick={() => setShowCredentialsForm(true)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Update EmailJS Credentials
              </button>
            </div>
          )}
          
          <ContactInput 
            placeholder="Your Name" 
            name="from_name" 
            value={formData.from_name}
            onChange={handleChange}
            required
          />
          <ContactInput 
            placeholder="Your Email" 
            name="from_email" 
            type="email"
            value={formData.from_email}
            onChange={handleChange}
            required
          />
          <ContactInput 
            placeholder="Subject" 
            name="subject" 
            value={formData.subject}
            onChange={handleChange}
          />
          <ContactInputMessage 
            placeholder="Your Message" 
            rows="4" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            required
          />
          <ContactButton 
            type="submit" 
            disabled={loading || !isEmailJSConfigured}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : !isEmailJSConfigured ? (
              "Setup EmailJS First"
            ) : (
              <>
                Send Message <SendIcon />
              </>
            )}
          </ContactButton>
        </ContactForm>
        
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert 
            onClose={() => setOpen(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Message sent successfully!
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={() => setError(false)}
        >
          <Alert 
            onClose={() => setError(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {errorMessage}
            {errorMessage && errorMessage.includes && errorMessage.includes("template") && (
              <button 
                onClick={() => setShowTroubleshooting(true)}
                style={{ 
                  display: 'block', 
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                Show troubleshooting guide
              </button>
            )}
          </Alert>
        </Snackbar>
        
        {showTroubleshooting && 
          <TroubleshootingGuide>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <TroubleshootingTitle>Template ID Error Troubleshooting</TroubleshootingTitle>
              <button 
                onClick={() => setShowTroubleshooting(false)}
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4527A0',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
            
            <TroubleshootingStep>
              <StepNumber>1</StepNumber>
              <div>
                Go to <SetupLink href="https://dashboard.emailjs.com/admin/templates" target="_blank">EmailJS Templates Dashboard</SetupLink> and 
                create a new template or check your existing ones.
              </div>
            </TroubleshootingStep>
            
            <TroubleshootingStep>
              <StepNumber>2</StepNumber>
              <div>
                Verify your template ID: <code>{credentials.templateId}</code> - it should exactly match what's in your dashboard.
              </div>
            </TroubleshootingStep>
            
            <TroubleshootingStep>
              <StepNumber>3</StepNumber>
              <div>
                Make sure your template includes these variables:
                <ul>
                  <li><code>{'{{from_name}}'}</code></li>
                  <li><code>{'{{from_email}}'}</code></li>
                  <li><code>{'{{subject}}'}</code></li>
                  <li><code>{'{{message}}'}</code></li>
                </ul>
              </div>
            </TroubleshootingStep>
            
            <TroubleshootingStep>
              <StepNumber>4</StepNumber>
              <div>
                Update the <code>templateId</code> value in the code with your actual template ID from the dashboard.
              </div>
            </TroubleshootingStep>
            
            <InfoAlert style={{ marginTop: '16px' }}>
              <strong>Tip:</strong> After creating a new template, you need to update the template ID in the code.
            </InfoAlert>
          </TroubleshootingGuide>
        }
      </Wrapper>
    </Container>
  )
}

export default Contact