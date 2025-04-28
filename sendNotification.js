// Netlify Serverless Function for Sending Email Notifications
// Note: In a production environment, you would use a real email service like SendGrid, Mailgun, etc.

exports.handler = async (event, context) => {
  // Set headers for CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }

  // Parse request body
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  // Extract parameters
  const { patientId, notificationType, email, stepDescription, dueDate } = requestBody;

  // Validate parameters
  if (!patientId || !notificationType) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Missing required parameters: patientId and notificationType'
      })
    };
  }

  try {
    // In a production environment, you would use a real email service
    // For demo purposes, we're just simulating a successful email send
    
    // Determine email subject and body based on notification type
    let emailSubject = '';
    let emailBody = '';
    
    switch (notificationType) {
      case 'reminder':
        emailSubject = 'Treatment Step Reminder';
        emailBody = `This is a reminder for your upcoming treatment step: ${stepDescription}. 
                    This step is due on ${new Date(dueDate).toLocaleDateString()}.`;
        break;
        
      case 'overdue':
        emailSubject = 'Overdue Treatment Step Alert';
        emailBody = `Your treatment step "${stepDescription}" was due on 
                    ${new Date(dueDate).toLocaleDateString()} and is now overdue. 
                    Please complete this step as soon as possible.`;
        break;
        
      case 'completion':
        emailSubject = 'Treatment Step Completed';
        emailBody = `Congratulations! You have successfully completed the treatment step: ${stepDescription}.`;
        break;
        
      default:
        emailSubject = 'Treatment Plan Update';
        emailBody = 'There has been an update to your treatment plan. Please check your portal for details.';
    }
    
    // Log email details (in production, you would actually send the email)
    console.log(`Sending email notification:
      To: ${email || 'patient@example.com'}
      Subject: ${emailSubject}
      Body: ${emailBody}
    `);
    
    // Simulate successful email send
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Notification sent successfully',
        details: {
          patientId,
          notificationType,
          emailSubject
        }
      })
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send notification',
        details: error.message
      })
    };
  }
}; 