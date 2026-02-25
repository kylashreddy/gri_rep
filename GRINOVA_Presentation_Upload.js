// Google Apps Script Code - GRINOVA Presentation Upload to Google Drive
// Target Drive Folder: https://drive.google.com/drive/folders/1LFt-tt9VCwJaDaH0GBbE_CUs0h-wWTOo
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Paste this code
// 4. Set the FOLDER_ID to your Google Drive folder ID (1LFt-tt9VCwJaDaH0GBbE_CUs0h-wWTOo)
// 5. Deploy as Web App (Execute as: Me, Anyone can access)
// 6. Copy the Web App URL and use it in your frontend

// UPDATE THIS: Your Google Drive Folder ID
var FOLDER_ID = '1LFt-tt9VCwJaDaH0GBbE_CUs0h-wWTOo';

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({ 
        result: "error", 
        message: "No Data Received" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var formPayload;
    
    try { 
      formPayload = JSON.parse(rawData); 
    } catch(parseError) {
      return ContentService.createTextOutput(JSON.stringify({ 
        result: "error", 
        message: "Invalid JSON: " + parseError.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if this is a presentation upload
    if (formPayload.type && formPayload.type === 'presentation') {
      return handlePresentationUpload(formPayload);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 
        result: "error", 
        message: "Invalid upload type" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch(errorMsg) {
    Logger.log('Error: ' + errorMsg.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: errorMsg.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handlePresentationUpload(data) {
  try {
    // Get the target folder
    var folder;
    try {
      folder = DriveApp.getFolderById(FOLDER_ID);
    } catch (folderError) {
      // If folder doesn't exist, create it in root
      folder = DriveApp.createFolder('GRINOVA Presentations ' + new Date().toISOString().split('T')[0]);
    }
    
    // Decode base64 file data
    var fileData = Utilities.base64Decode(data.fileData);
    
    // Create filename with team name and timestamp
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    var fileName = data.teamName + '_' + data.fileName;
    
    // Create the file in Google Drive
    var file = folder.createFile(fileName, fileData, data.mimeType);
    
    // Log submission details
    logSubmission(data, file.getUrl());
    
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "success",
      fileName: fileName,
      fileUrl: file.getUrl(),
      folderUrl: folder.getUrl(),
      message: "Presentation uploaded successfully!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log('Upload Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: "Upload failed: " + error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function logSubmission(data, fileUrl) {
  try {
    // Try to log to a spreadsheet, or just log to Drive
    var logFolder;
    try {
      logFolder = DriveApp.getFolderById(FOLDER_ID);
    } catch(e) {
      logFolder = DriveApp.getRootFolder();
    }
    
    // Create a log entry
    var logContent = 'GRINOVA Presentation Upload Log\n';
    logContent += '========================\n';
    logContent += 'Timestamp: ' + new Date().toString() + '\n';
    logContent += 'Team Name: ' + data.teamName + '\n';
    logContent += 'Team Leader: ' + data.teamLeader + '\n';
    logContent += 'Email: ' + data.email + '\n';
    logContent += 'File Name: ' + data.fileName + '\n';
    logContent += 'File URL: ' + fileUrl + '\n';
    logContent += '\n';
    
    // Create log file
    logFolder.createFile('upload_log_' + new Date().getTime() + '.txt', logContent);
    
  } catch(logError) {
    Logger.log('Logging Error: ' + logError.toString());
  }
}

// Handle GET requests
function doGet() {
  return ContentService.createTextOutput('GRINOVA Presentation Upload API is Running');
}

// Test function to check folder access
function testFolderAccess() {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    return 'Folder found: ' + folder.getName() + '\nURL: ' + folder.getUrl();
  } catch(e) {
    return 'Error: ' + e.toString();
  }
}
